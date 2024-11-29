'use server';
export async function parentsTemplate(verificationToken: string, studentName: string, parentName: string, resendHeader: string) {
  let contentHeader;
  let contentFooter;
  let titleLabel;
  switch (resendHeader) {
    case 'View Grades':
      titleLabel = 'View Grades';
      contentHeader = `Dear Parent/Guardian, I hope this email finds you well. You can securely view the grades of your adult son or child ${studentName} by accessing the link below:`;
      contentFooter = 'This email was sent to provide access for viewing grades. Please do not share this link with anyone for security purposes.';
  }
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Transactional Email</title>
      <style media="all" type="text/css">
  @media all {
    .btn-primary table td:hover {
      background-color: #0867ec !important;
    }
  
    .btn-primary a:hover {
      background-color: #075cd4 !important;
      border-color: #0867ec !important;
    }
  }
  @media only screen and (max-width: 640px) {
    .main p,
  .main td,
  .main span {
      font-size: 16px !important;
    }
  
    .wrapper {
      padding: 8px !important;
    }
  
    .content {
      padding: 0 !important;
    }
  
    .container {
      padding: 0 !important;
      padding-top: 8px !important;
      width: 100% !important;
    }
  
    .main {
      border-left-width: 0 !important;
      border-radius: 0 !important;
      border-right-width: 0 !important;
    }
  
    .btn table {
      max-width: 100% !important;
      width: 100% !important;
    }
  
    .btn a {
      font-size: 16px !important;
      max-width: 100% !important;
      width: 100% !important;
    }
  }
  @media all {
    .ExternalClass {
      width: 100%;
    }
  
    .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
      line-height: 100%;
    }
  
    .apple-link a {
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      text-decoration: none !important;
    }
  
    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
  }
  </style>
    </head>
    <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6">
        <tr>
          <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
          <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px; width: 600px; margin: 0 auto;" width="600" valign="top">
            <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">
  
              <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;" width="100%">
                <tr>
                  <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 15px;" valign="top">
                    <div style="display: flex; align-items: center;">
                      <img src="https://nextjs-enrollment.vercel.app/images/logo1.png" alt="Logo" style="width: 75px; height: 75px;" />
                    </div>
                  </td>
                </tr>
                <tr> 
                  <td class="wrapper" style="font-family: Helvetica, sans-serif; text-align: center; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 25px;" valign="top">
                      <p style="font-family: Helvetica, sans-serif; font-size: 32px; font-weight: 600; margin: 0;">
                        ${titleLabel}
                      </p>
                  </td>
                </tr>
                <tr>
                  <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top">
                    <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px; text-transform: capitalize;">Hi there ${parentName},</p>
                    <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">
                      ${contentHeader}
                    </p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn " style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%">
                      <tbody>
                        <tr>
                          <td align="center" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                              <tbody>
                                <tr>
                                  <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center;" valign="top" align="center">
                                    <a href="https://nextjs-enrollment.vercel.app/view/grades?token=${verificationToken}" style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: 600; text-align: center; text-decoration: none; color: #ffffff; background-color: #007bff; padding: 10px 20px; border-radius: 4px; display: inline-block; margin: 0;">
                                      View Grades
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${contentFooter}</p>
                    <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Good day, Have fun!</p>
                  </td>
                </tr>
  
                </table>
  
              <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; margin-bottom: 13px" width="100%">
                  <tr>
                    <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #9a9ea6; font-size: 16px; text-align: center;" valign="top" align="center">
                      <span class="apple-link" style="color: #9a9ea6; font-size: 16px; text-align: center;">
                       DCIT INC., Minaog, Dipolog City
                      </span>
                      <br> 
                      Having problems? 
                      <a href="GMedia.onrender.com" style="text-decoration: underline; color: #9a9ea6; font-size: 16px; text-align: center;">
                      +639123456789</a>.
                    </td>
                  </tr>
                </table>
              </div>
  
              
        </div>
          </td>
          <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>`;
}
