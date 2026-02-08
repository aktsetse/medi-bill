/**
 * Parse and format appeal letter into structured sections
 */
export function parseAppealLetter(rawText: string): {
    date: string;
    senderInfo: string[];
    recipientInfo: string[];
    subject: string;
    salutation: string;
    body: string[];
    closing: string;
    signature: string;
} {
    // Default structure
    const result = {
        date: "",
        senderInfo: [] as string[],
        recipientInfo: [] as string[],
        subject: "",
        salutation: "",
        body: [] as string[],
        closing: "Sincerely,",
        signature: "",
    };

    // Try to extract date (look for common date patterns)
    const dateMatch = rawText.match(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i
    );
    if (dateMatch) {
        result.date = dateMatch[0];
    }

    // Extract subject line
    const subjectMatch = rawText.match(/Subject:\s*(.+?)(?=Dear|To Whom)/i);
    if (subjectMatch) {
        result.subject = subjectMatch[1].trim();
    }

    // Extract salutation
    const salutationMatch = rawText.match(/Dear\s+[^,]+,/i);
    if (salutationMatch) {
        result.salutation = salutationMatch[0];
    }

    // Extract closing and signature
    const closingMatch = rawText.match(/(Sincerely|Respectfully|Best regards|Thank you),?\s*\n*([\s\S]*?)$/i);
    if (closingMatch) {
        result.closing = closingMatch[1] + ",";
        result.signature = closingMatch[2]?.trim() || "";
    }

    // The body is everything between salutation and closing
    let bodyText = rawText;

    // Remove date
    if (result.date) {
        bodyText = bodyText.replace(result.date, "");
    }

    // Remove subject
    if (result.subject) {
        bodyText = bodyText.replace(`Subject: ${result.subject}`, "");
        bodyText = bodyText.replace(result.subject, "");
    }

    // Remove salutation
    if (result.salutation) {
        const salutationIndex = bodyText.indexOf(result.salutation);
        if (salutationIndex !== -1) {
            bodyText = bodyText.substring(salutationIndex + result.salutation.length);
        }
    }

    // Remove closing
    if (closingMatch) {
        bodyText = bodyText.replace(closingMatch[0], "");
    }

    // Split body into paragraphs
    result.body = bodyText
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0 && p.length > 20);

    return result;
}

/**
 * Format the letter as clean text for copying/PDF
 */
export function formatLetterAsText(rawText: string): string {
    // Basic formatting - add line breaks after common patterns
    let formatted = rawText
        // Add breaks after date patterns
        .replace(/(\d{4})([A-Z])/g, "$1\n\n$2")
        // Add breaks before "Dear"
        .replace(/(Dear\s+)/gi, "\n\n$1")
        // Add breaks before "Subject:"
        .replace(/(Subject:)/gi, "\n\n$1")
        // Add breaks after Subject line (before Dear)
        .replace(/(Subject:[^\n]+)/gi, "$1\n")
        // Format patient details in subject lines - add line breaks before each field
        .replace(/,\s*(Patient:)/gi, "\n$1")
        .replace(/,\s*(Member ID:)/gi, "\n$1")
        .replace(/,\s*(Service Date:)/gi, "\n$1")
        .replace(/,\s*(Bill ID:)/gi, "\n$1")
        .replace(/,\s*(Claim ID:)/gi, "\n$1")
        .replace(/,\s*(Claim Number:)/gi, "\n$1")
        .replace(/,\s*(Date of Service:)/gi, "\n$1")
        .replace(/,\s*(Account Number:)/gi, "\n$1")
        .replace(/-\s*(Patient:)/gi, "\n$1")
        .replace(/-\s*(Member ID:)/gi, "\n$1")
        .replace(/-\s*(Service Date:)/gi, "\n$1")
        .replace(/-\s*(Bill ID:)/gi, "\n$1")
        // Add breaks before closing phrases
        .replace(/(Sincerely|Respectfully|Best regards|Thank you)/gi, "\n\n$1")
        // Add paragraph breaks between sentences that start new topics
        .replace(/\.\s*(I am writing|I request|I expect|Please|Furthermore|Additionally|Moreover)/gi, ".\n\n$1")
        // Clean up multiple newlines
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return formatted;
}
