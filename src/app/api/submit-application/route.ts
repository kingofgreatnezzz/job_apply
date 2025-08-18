import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const application = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      address: formData.get('address') as string,
      employment_status: formData.get('employmentStatus') as string,
      ssn: formData.get('ssn') as string,
      id_card_front_url: null as string | null,
      id_card_back_url: null as string | null
    };

    // Handle file uploads to Supabase Storage
    const idCardFrontFile = formData.get('idCardFront') as File;
    const idCardBackFile = formData.get('idCardBack') as File;

    // Upload front ID card if present
    if (idCardFrontFile) {
      const fileName = `${Date.now()}_front_${idCardFrontFile.name}`;
      const { error: frontError } = await supabase.storage
        .from('jobapp')
        .upload(fileName, idCardFrontFile);

      if (frontError) {
        console.error('Error uploading front ID card:', frontError);
        return NextResponse.json(
          { success: false, message: 'Error uploading front ID card' },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded file
      const { data: frontUrlData } = supabase.storage
        .from('jobapp')
        .getPublicUrl(fileName);
      
      application.id_card_front_url = frontUrlData.publicUrl;
    }

    // Upload back ID card if present
    if (idCardBackFile) {
      const fileName = `${Date.now()}_back_${idCardBackFile.name}`;
      const { error: backError } = await supabase.storage
        .from('jobapp')
        .upload(fileName, idCardBackFile);

      if (backError) {
        console.error('Error uploading back ID card:', backError);
        return NextResponse.json(
          { success: false, message: 'Error uploading back ID card' },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded file
      const { data: backUrlData } = supabase.storage
        .from('jobapp')
        .getPublicUrl(fileName);
      
      application.id_card_back_url = backUrlData.publicUrl;
    }

    // Insert application into database
    const { data: insertedApplication, error: insertError } = await supabase
      .from('job_applications')
      .insert([application])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting application:', insertError);
      return NextResponse.json(
        { success: false, message: 'Error saving application to database' },
        { status: 500 }
      );
    }

    console.log('Application saved successfully:', insertedApplication.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: insertedApplication.id
    });

  } catch (err) {
    console.error('Error submitting application:', err);
    return NextResponse.json(
      { success: false, message: 'Error submitting application' },
      { status: 500 }
    );
  }
} 