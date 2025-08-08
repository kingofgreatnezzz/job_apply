import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params;
    const filenameString = filename.join('/');
    
    // Decode the URL-encoded filename
    const decodedFilename = decodeURIComponent(filenameString);
    
    console.log('Attempting to serve file:', decodedFilename);
    
    // Use /tmp directory for Vercel (writable in serverless functions)
    const dataDir = process.env.NODE_ENV === 'production' 
      ? '/tmp/data' 
      : path.join(process.cwd(), 'data');
    
    const uploadsDir = path.join(dataDir, 'uploads');
    const filePath = path.join(uploadsDir, decodedFilename);

    console.log('Looking for file at:', filePath);

    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      console.log('File not found at:', filePath);
      return NextResponse.json(
        { error: 'File not found', path: filePath, requestedFile: decodedFilename },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);
    console.log('File read successfully, size:', fileBuffer.length);
    
    // Determine content type based on file extension
    const ext = path.extname(decodedFilename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.webp') contentType = 'image/webp';

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${decodedFilename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Error serving file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 