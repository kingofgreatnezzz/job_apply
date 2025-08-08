import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const application = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      address: formData.get('address') as string,
      employmentStatus: formData.get('employmentStatus') as string,
      ssn: formData.get('ssn') as string,
      idCardFrontFileName: null as string | null,
      idCardBackFileName: null as string | null
    };

    // Try to save to file system (works in development, may not work in production)
    try {
      // Use /tmp directory for Vercel (writable in serverless functions)
      const dataDir = process.env.NODE_ENV === 'production' 
        ? '/tmp/data' 
        : path.join(process.cwd(), 'data');
      
      await fs.ensureDir(dataDir);
      
      // Save application data
      const applicationsFile = path.join(dataDir, 'applications.json');
      let applications = [];
      
      try {
        const existingData = await fs.readFile(applicationsFile, 'utf-8');
        applications = JSON.parse(existingData);
      } catch (error) {
        // File doesn't exist or is empty, start with empty array
        applications = [];
      }

      // Handle file uploads if present
      const uploadsDir = path.join(dataDir, 'uploads');
      await fs.ensureDir(uploadsDir);
      
      // Handle front ID card
      const idCardFrontFile = formData.get('idCardFront') as File;
      if (idCardFrontFile) {
        const bytes = await idCardFrontFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${application.id}_front_${idCardFrontFile.name}`;
        const filePath = path.join(uploadsDir, fileName);
        
        await fs.writeFile(filePath, buffer);
        application.idCardFrontFileName = fileName; // Store the full file name
      }
      
      // Handle back ID card
      const idCardBackFile = formData.get('idCardBack') as File;
      if (idCardBackFile) {
        const bytes = await idCardBackFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${application.id}_back_${idCardBackFile.name}`;
        const filePath = path.join(uploadsDir, fileName);
        
        await fs.writeFile(filePath, buffer);
        application.idCardBackFileName = fileName; // Store the full file name
      }

      applications.push(application);
      await fs.writeFile(applicationsFile, JSON.stringify(applications, null, 2));

      console.log('Application saved successfully:', application.id);
      
    } catch (fileError) {
      // If file system operations fail, log the data instead
      console.log('File system not available, logging data:', JSON.stringify(application, null, 2));
      console.log('File system error:', fileError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application.id
    });

  } catch (err) {
    console.error('Error submitting application:', err);
    return NextResponse.json(
      { success: false, message: 'Error submitting application' },
      { status: 500 }
    );
  }
} 