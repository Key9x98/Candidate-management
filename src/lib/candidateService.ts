import { supabase, type Candidate, type CandidateInsert,  STORAGE_BUCKETS,  } from './supabase';

export class CandidateService {
  /**
   * Fetch all candidates for the current user
   */
  static async fetchCandidates(): Promise<Candidate[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch candidates: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  /**
   * Add a new candidate using Edge Function
   */
  static async addCandidate(candidateData: CandidateInsert): Promise<Candidate> {
    try {
      const { data, error } = await supabase.functions.invoke('add-candidate', {
        body: candidateData
      });

      if (error) {
        throw new Error(`Failed to add candidate: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from add-candidate function');
      }

      return data;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  }

  /**
   * Update candidate status
   */
  static async updateCandidateStatus(candidateId: string, status: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('candidates')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId)
        .eq('user_id', user.id); // Ensure user can only update their own candidates

      if (error) {
        throw new Error(`Failed to update candidate status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }
  }

  /**
   * Delete a candidate
   */
  static async deleteCandidate(candidateId: string): Promise<void> {
    try {
      // Step 1: Lấy thông tin của ứng viên, đặc biệt là resume_url, TRƯỚC KHI xóa.
      // Hàm getCandidateById đã bao gồm việc xác thực người dùng.
      const candidate = await this.getCandidateById(candidateId);

      // Nếu không tìm thấy ứng viên (hoặc không thuộc sở hữu của user), không làm gì cả.
      if (!candidate) {
        console.warn(`Candidate with ID ${candidateId} not found or user does not have permission.`);
        return;
      }
      
      // Giữ lại resumeUrl để sử dụng sau khi bản ghi DB đã bị xóa
      const resumeUrlToDelete = candidate.resume_url;
      console.log(resumeUrlToDelete)
      // Step 2: Xóa bản ghi của ứng viên khỏi cơ sở dữ liệu.
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated for deletion');
      }

      const { error: dbError } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId)
        .eq('user_id', user.id); // Double-check ownership for security

      if (dbError) {
        throw new Error(`Failed to delete candidate from database: ${dbError.message}`);
      }

      console.log(`Successfully deleted candidate ${candidateId} from database.`);

      // Step 3: Nếu ứng viên có resume_url, hãy xóa tệp tương ứng trong Storage.
      if (resumeUrlToDelete) {
        console.log(`Attempting to delete resume file: ${resumeUrlToDelete}`);
        // Gọi hàm deleteResume bạn đã viết sẵn
        await this.deleteResume(resumeUrlToDelete);
        console.log(`Successfully deleted resume file for candidate ${candidateId}.`);
      }

    } catch (error) {
      console.error('Error during the candidate deletion process:', error);
      // Ném lại lỗi để component UI có thể xử lý (ví dụ: hiển thị thông báo lỗi)
      throw error;
    }
  }

  /**
   * Update candidate information
   */
  static async updateCandidate(
    candidateId: string, 
    updateData: {
      full_name?: string;
      applied_position?: string;
      created_at?: string;
      resume_file?: File | null;
    }
  ): Promise<Candidate> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get current candidate data
      const currentCandidate = await this.getCandidateById(candidateId);
      if (!currentCandidate) {
        throw new Error('Candidate not found');
      }

      let resumeUrl = currentCandidate.resume_url;

      // Handle resume file update
      if (updateData.resume_file) {
        // Delete old resume if exists
        if (currentCandidate.resume_url) {
          await this.deleteResume(currentCandidate.resume_url);
        }
        
        // Upload new resume
        resumeUrl = await this.uploadResume(updateData.resume_file, user.id);
      }

      // Prepare update data
      const updatePayload: any = {
        updated_at: new Date().toISOString()
      };

      if (updateData.full_name !== undefined) {
        updatePayload.full_name = updateData.full_name;
      }
      if (updateData.applied_position !== undefined) {
        updatePayload.applied_position = updateData.applied_position;
      }
      if (updateData.created_at !== undefined) {
        updatePayload.created_at = updateData.created_at;
      }
      if (resumeUrl !== currentCandidate.resume_url) {
        updatePayload.resume_url = resumeUrl;
      }

      // Update candidate in database
      const { data, error } = await supabase
        .from('candidates')
        .update(updatePayload)
        .eq('id', candidateId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update candidate: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  }

  /**
   * Upload resume file to Supabase Storage
   */
// service/candidateService.ts

static async uploadResume(file: File, userId: string): Promise<string> {
    try {
      // ... (Phần validate file type và size giữ nguyên)
      if (file.type !== 'application/pdf') {
        throw new Error('Chỉ cho phép tệp PDF');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Kích thước tệp phải nhỏ hơn 10MB');
      }

      // SỬ DỤNG HÀM LÀM SẠCH TÊN TỆP Ở ĐÂY
      const sanitizedFileName = sanitizeFileName(file.name);
      
      // Tạo đường dẫn với tên tệp đã được làm sạch
      const filePath = `${userId}/${sanitizedFileName}`;

      console.log('Đang tải lên tệp:', filePath);
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.RESUMES)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // Lỗi bây giờ sẽ rõ ràng hơn nếu có vấn đề khác
        throw new Error(`Không thể tải tệp lên: ${uploadError.message}`);
      }

      // Lấy public URL một cách an toàn
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.RESUMES)
        .getPublicUrl(filePath);

      if (!data || !data.publicUrl) {
          throw new Error('Không thể lấy URL công khai cho tệp đã tải lên.');
      }
      
      return data.publicUrl;

    } catch (error) {
      console.error('Lỗi khi tải CV lên:', error);
      throw error;
    }
  }

  /**
   * Delete resume file from Supabase Storage
   */
static async deleteResume(fileUrl: string): Promise<void> {
  try {
    console.log('Attempting to delete file from URL:', fileUrl);

    const prefix = `/storage/v1/object/public/${STORAGE_BUCKETS.RESUMES}/`;
    const url = new URL(fileUrl);

    if (!url.pathname.startsWith(prefix)) {
      throw new Error('Invalid file URL format for Supabase storage');
    }

    // Lấy phần path sau prefix
    const filePath = url.pathname.replace(prefix, '');
    console.log('Extracted file path:', filePath);
    
    await supabase.storage
    .from(STORAGE_BUCKETS.RESUMES)
    .remove([filePath]);


    console.log('Successfully deleted file:', filePath);

  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}


  /**
   * Setup realtime subscription for candidates
   */
  static setupRealtimeSubscription(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('candidates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidates',
        },
        (payload) => {
          console.log('Realtime update:', payload);
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Get candidate by ID
   */
  static async getCandidateById(candidateId: string): Promise<Candidate | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidateId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        throw new Error(`Failed to get candidate: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting candidate:', error);
      throw error;
    }
  }

  /**
   * Search candidates by name or position
   */
  static async searchCandidates(query: string): Promise<Candidate[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .or(`full_name.ilike.%${query}%,applied_position.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search candidates: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  }
}

export function sanitizeFileName(fileName: string): string {
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  const extension = fileName.substring(fileName.lastIndexOf('.'));

  let sanitized = nameWithoutExtension
    .toLowerCase() // 1. Chuyển thành chữ thường
    .normalize('NFD') // 2. Chuẩn hóa Unicode để tách dấu ra khỏi chữ
    .replace(/[\u0300-\u036f]/g, '') // 3. Xóa các ký tự dấu
    .replace(/đ/g, 'd'); // 4. Chuyển đổi chữ 'đ' thành 'd'

  sanitized = sanitized
    .replace(/\s+/g, '-') // 5. Thay thế dấu cách bằng dấu gạch ngang
    .replace(/[^\w-]+/g, ''); // 6. Xóa tất cả các ký tự không phải là chữ, số, hoặc gạch ngang

  return sanitized + extension; // 7. Gắn lại phần mở rộng của tệp
}