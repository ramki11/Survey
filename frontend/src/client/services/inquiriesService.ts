import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { InquiriesPublic, InquiryCreate, InquiryPublic } from "../models";

export interface TDataCreateInquiry {
  requestBody: InquiryCreate;
}

export interface TDataReadInquiry {
  limit?: number;
  skip?: number;
}

export function createInquiry(
  data: TDataCreateInquiry
): CancelablePromise<InquiryPublic> {
  const { requestBody } = data;
  return __request(OpenAPI, {
    method: "POST",
    url: "/api/v1/inquiries/",
    body: requestBody,
    mediaType: "application/json",
    errors: {
      422: "Validation Error",
    },
  });
}

export function readInquiries(
  data: TDataReadInquiry = {}
): CancelablePromise<InquiriesPublic> {
  const { limit = 100, skip = 0 } = data;
  return __request(OpenAPI, {
    method: "GET",
    url: "/api/v1/inquiries/",
    query: {
      skip,
      limit,
    },
    errors: {
      422: "Validation Error",
    },
  });
}


export async function updateInquiry(updatedInquiry: InquiryPublic): Promise<InquiryPublic> {
  try {
    const response = await fetch(`/api/inquiries/${updatedInquiry.id}`, { // Adjust the endpoint if needed
      method: 'PUT', // Or 'PATCH', depending on your backend implementation
      headers: {
        'Content-Type': 'application/json',
        // Include any necessary authentication headers here
      },
      body: JSON.stringify(updatedInquiry),
    });

    if (!response.ok) {
      throw new Error('Failed to update inquiry');
    }

    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error('Error updating inquiry:', error);
    throw error; // Re-throw so the error can be handled by your mutation's onError
  }
}