import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    // Check if data directory and file exist
    if (!await fs.pathExists(applicationsFile)) {
      return NextResponse.json({ applications: [] });
    }

    const data = await fs.readFile(applicationsFile, 'utf-8');
    const applications = JSON.parse(data);

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
} 