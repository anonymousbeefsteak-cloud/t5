
import { API_URL } from '../constants';
import { Order, ApiResponse } from '../types';

// Helper to generate a unique ID for request tracking
const generateRequestId = (): string => `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Secure HTTP client with timeout and retry logic
async function secureFetch(url: string, options: RequestInit, retries = 2, timeout = 15000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const sessionId = sessionStorage.getItem('sessionId') || `session-${Date.now()}`;
    sessionStorage.setItem('sessionId', sessionId);

    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'mock-csrf-token-for-demonstration', // In a real app, this would be dynamically generated
        'X-Request-ID': generateRequestId(),
        'X-Session-ID': sessionId,
        ...options.headers,
    };
    
    try {
        const response = await fetch(url, { ...options, headers, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            // Server-side errors that might be worth retrying
            if (response.status >= 500 && retries > 0) {
                console.warn(`Server error ${response.status}. Retrying... (${retries} left)`);
                await new Promise(res => setTimeout(res, 1000)); // wait 1s before retry
                return secureFetch(url, options, retries - 1, timeout);
            }
            // For other errors, create a structured error message
            const errorText = await response.text().catch(() => 'Could not read error response.');
            throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
             throw new Error('Request timed out. Please try again.');
        }
        // If retries are exhausted or it's a non-retryable error
        if (retries > 0 && error instanceof TypeError) { // Network errors
            console.warn(`Network error. Retrying... (${retries} left)`);
            await new Promise(res => setTimeout(res, 1000));
            return secureFetch(url, options, retries - 1, timeout);
        }
        throw error;
    }
}


export const saveOrder = async (orderData: Order): Promise<ApiResponse> => {
    try {
        const response = await secureFetch(API_URL, {
            method: 'POST',
            // Google Apps Script doPost needs a stringified payload with a specific structure
            body: JSON.stringify({
                action: 'saveOrder',
                orderData: orderData,
            }),
            // mode: 'no-cors' is not needed with correct Apps Script headers
        });

        const result: ApiResponse = await response.json();

        // The provided backend returns success even on some errors, check message.
        if (!result.success) {
            console.error('API reported failure:', result.message);
            throw new Error(result.message || 'The API service reported a failure.');
        }

        return result;

    } catch (error) {
        console.error('Failed to save order:', error);
        // Return a standardized error format
        const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
        return { success: false, message: `Submission failed: ${errorMessage}` };
    }
};
