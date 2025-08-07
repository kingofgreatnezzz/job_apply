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
      idCardFileName: formData.get('idCard') ? (formData.get('idCard') as File).name : null
    };

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    await fs.ensureDir(dataDir);

    // Save application data
    const applicationsFile = path.join(dataDir, 'applications.json');
    let applications = [];
    
    try {
      const existingData = await fs.readFile(applicationsFile, 'utf-8');
      applications = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
    }

    applications.push(application);
    await fs.writeFile(applicationsFile, JSON.stringify(applications, null, 2));

    // Handle file upload if present
    const idCardFile = formData.get('idCard') as File;
    if (idCardFile) {
      const uploadsDir = path.join(dataDir, 'uploads');
      await fs.ensureDir(uploadsDir);
      
      const bytes = await idCardFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${application.id}_${idCardFile.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      await fs.writeFile(filePath, buffer);
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