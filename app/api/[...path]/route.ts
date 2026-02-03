export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const backendUrl = `http://localhost:3001/api${path}${url.search}`;
  
  const response = await fetch(backendUrl);
  const data = await response.json();
  
  return Response.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  // Handle FormData (file uploads)
  const contentType = request.headers.get('content-type');
  if (contentType?.includes('multipart/form-data') || contentType === null) {
    const formData = await request.formData();
    const response = await fetch(`http://localhost:3001/api${path}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  }
  
  // Handle JSON
  const body = await request.json();
  const response = await fetch(`http://localhost:3001/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  let body = {};
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch (e) {
    // No body or invalid JSON
  }
  
  const response = await fetch(`http://localhost:3001/api${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = { success: true };
  }
  
  return Response.json(data, { status: response.status });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  const response = await fetch(`http://localhost:3001/api${path}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
