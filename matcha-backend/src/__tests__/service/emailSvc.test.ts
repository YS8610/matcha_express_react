import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {sendMail as sendEmail} from "../../service/emailSvc.js";

describe("Testing emailSvc", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("sends an email using nodemailer", async () => {
    const mockSendMail = vi.fn().mockResolvedValueOnce({} as any);
    const mockCreateTransport = vi.fn().mockReturnValue({ sendMail: mockSendMail });
    const nodemailer = { createTransport: mockCreateTransport } as any;

    const from = "<sender@example.com>";
    const to = "<recipient@example.com>";
    const subject = "Test Email";
    const text = "This is a test email.";

    await sendEmail(from, to, subject, text, nodemailer);

    expect(mockCreateTransport).toHaveBeenCalledTimes(1);
    expect(mockCreateTransport).toHaveBeenCalledWith({
      service: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith({
      from,
      to,
      subject,
      html:text
    });
  });
});
