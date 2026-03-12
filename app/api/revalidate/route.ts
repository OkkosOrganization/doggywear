import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST() {
  // @ts-ignore
  revalidateTag('prismic');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
