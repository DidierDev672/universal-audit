import axios from "axios";

export const SCREENING_RESPONSES_API =
  "http://localhost:3000/api/v1/screening-responses";

const REQUEST_TIMEOUT_MS = 30_000;

/** DELETE /api/v1/screening-responses/:id */
export async function deleteScreeningResponse(id: string): Promise<void> {
  await axios.delete(`${SCREENING_RESPONSES_API}/${id}`, {
    timeout: REQUEST_TIMEOUT_MS,
  });
}
