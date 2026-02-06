import { proxyToPython } from '../_proxy';

export async function POST(req: Request) {
  return proxyToPython(req, '/ai/analyze_tone');
}
