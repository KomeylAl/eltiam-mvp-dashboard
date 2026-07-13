import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function unauthenticatedResponse(): NextResponse {
  return jsonResponse({ message: "Unauthenticated." }, 401);
}

export function forbiddenResponse(
  message = "Only therapists can access this resource."
): NextResponse {
  return jsonResponse({ message }, 403);
}

export function notFoundResponse(): NextResponse {
  return jsonResponse({ message: "Not found." }, 404);
}

export function validationErrorResponse(error: ZodError): NextResponse {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".");
    errors[field] = errors[field] ?? [];
    errors[field].push(issue.message);
  }

  return jsonResponse(
    {
      message: "The given data was invalid.",
      errors,
    },
    422
  );
}

export function invalidCredentialsResponse(): NextResponse {
  return jsonResponse(
    {
      message: "The provided credentials are incorrect.",
      errors: {
        phone: ["The provided credentials are incorrect."],
      },
    },
    422
  );
}
