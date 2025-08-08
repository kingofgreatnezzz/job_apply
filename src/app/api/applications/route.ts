import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

export async function GET() {
  try {
    // Use /tmp directory for Vercel (writable in serverless functions)
    const dataDir = process.env.NODE_ENV === 'production' 
      ? '/tmp/data' 
      : path.join(process.cwd(), 'data');
    
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    try {
      const existingData = await fs.readFile(applicationsFile, 'utf-8');
      const applications = JSON.parse(existingData);
      
      return NextResponse.json({ 
        applications: applications || [],
        count: applications?.length || 0
      });
    } catch (error) {
      // File doesn't exist or is empty
      return NextResponse.json({ 
        applications: [],
        count: 0
      });
    }
  } catch (error) {
    console.error('Error reading applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const application = await request.json();
    
    // Use /tmp directory for Vercel (writable in serverless functions)
    const dataDir = process.env.NODE_ENV === 'production' 
      ? '/tmp/data' 
      : path.join(process.cwd(), 'data');
    
    await fs.ensureDir(dataDir);
    
    const applicationsFile = path.join(dataDir, 'applications.json');
    let applications = [];
    
    try {
      const existingData = await fs.readFile(applicationsFile, 'utf-8');
      applications = JSON.parse(existingData);
    } catch (error) {
      applications = [];
    }

    const newApplication = {
      ...application,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    applications.push(newApplication);
    await fs.writeFile(applicationsFile, JSON.stringify(applications, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application stored successfully',
      applicationId: newApplication.id 
    });
  } catch (err) {
    console.error('Error storing application:', err);
    return NextResponse.json(
      { success: false, message: 'Error storing application' },
      { status: 500 }
    );
  }
} 