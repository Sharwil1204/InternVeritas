# Implement Missing Backend API for Company Verification

I investigated why the domain age was showing as "Unknown" and the companies weren't rendering. It turns out that the `/search-company` API endpoint was **completely missing** from the backend code (`backend/index.js`)! The frontend was trying to call it, but failing and defaulting to "Unknown".

Here is the plan to build the missing backend logic so it can fetch real company websites and calculate their actual domain age.

## User Review Required

Please review this plan. If you approve, I will write the code to fetch real company details from Google and calculate the domain age!

## Proposed Changes

### Add Company Search Endpoint

#### [MODIFY] [backend/index.js](file:///c:/Users/Lenovo/OneDrive/Desktop/intern-project/backend/index.js)
- Add a new `app.get("/search-company")` endpoint.
- **Search Logic:** Use the `SERPER_API_KEY` to make a search request to Google for the provided company name to find its official website URL.
- **Domain Age Logic:** Parse the URL to get the root domain. Use the existing `whois` package to lookup the domain's `Creation Date`. Calculate the age in years/months.
- **Response:** Return the found company details and calculated domain age to the frontend in the format `CompanySelectionModal.tsx` expects.

## Verification Plan

### Automated Tests
- Restart the local backend server.
- Test the endpoint locally: `curl "http://localhost:5000/search-company?name=Corizo"`

### Manual Verification
- Test the application UI. Enter "Corizo" in the form.
- Verify that the modal successfully pops up with the correct company website and real domain age (e.g., "3 years old") instead of "Unknown".
