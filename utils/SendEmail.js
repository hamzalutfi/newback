const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  // 1) create treansporter we here sepcify the service that we want to use like [gmail, hotmail, ....] and another things as you see
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Defiend the mail options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.String,
    html: options.html,
  };

  // 3) we actaully send the email here
  await transporter.sendMail(mailOptions);
};

exports.sendResetPasswordEmail = async (options) => {
  // 1) create treansporter we here sepcify the service that we want to use like [gmail, hotmail, ....] and another things as you see
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Defiend the mail options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: "Reset Password",
    html: `

    <html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Reset Your Doctorna Password</title>
  <style type="text/css">
    /* Base styles */
    @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap');

    body {
      font-family: 'Nunito Sans', sans-serif;
      -webkit-text-size-adjust: none;
      width: 100% !important;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    a {
      color: blue;
      margin:5px,
    }

    /* Typography */
    h1,
    h2,
    h3,
    p {
      margin:0,
    }

    h1 {
      color: black;
      font-size: 22px;
      font-weight: bold;
      margin:5px,
    }

    h2 {
      color: black;
      font-size: 16px;
      font-weight: bold;
      margin:5px,
    }

    p {
      font-size: 16px;
      line-height: 1.5;
    }

    /* Button */
    .button {
      display: inline-block;
      background-color: #93c47d;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 4px;
      margin-top: 20px;
      margin:5px,
    }

    /* Media Queries */
    @media only screen and (max-width: 600px) {
      .button {
        display: block;
        width: 100%;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation">
          <!-- Email Body -->
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" role="presentation">
                <!-- Body content -->
                <tr>
                  <td>
                    <div>
                      <h1>Reset Your Hope maker Password</h1>
                      <p>You recently requested to reset your password for your Hope Maker account. Use the code below to reset it. <strong>This password reset is only valid for the next 24 hours.</strong></p>
                      <!-- Action -->
                      <div align="center" role="presentation">
                          <div align="center" style='padding:10px;background-color:#93c47d;'>
                            <p style='font-size:2em;font-weight:700;'>${options.restToken
                              .split("")
                              .join(" - ")}</a>
                          </div>
                      </div>
                      <p>For security, If you did not request a password reset, please ignore this email or <a href="{{support_url}}">contact support</a> if you have questions.</p>
                      <p>Thanks,<br>Doctorna Online team</p>
                      <!-- Sub copy -->
                      <p class="sub">If you’re having trouble with the code above, contact us.</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Email Footer -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <p>Doctorna.Online</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`,
  };

  // 3) we actaully send the email here
  await transporter.sendMail(mailOptions);
};
exports.sendActivationEmail = async (options) => {
  // 1) create treansporter we here sepcify the service that we want to use like [gmail, hotmail, ....] and another things as you see
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Defiend the mail options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: "Activate doctorna account",
    html: `

    <html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Activate your Hope Maker account</title>
  <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */

    @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
    }

    a {
      color: #3869D4;
    }

    a img {
      border: none;
    }

    td {
      word-break: break-word;
    }

    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    /* Type ------------------------------ */

    body,
    td,
    th {
      font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
    }

    h1 {
      margin-top: 0;
      color: #333333;
      font-size: 22px;
      font-weight: bold;
      text-align: left;
    }

    h2 {
      margin-top: 0;
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }

    h3 {
      margin-top: 0;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }

    td,
    th {
      font-size: 16px;
    }

    p,
    ul,
    ol,
    blockquote {
      margin: .4em 0 1.1875em;
      font-size: 16px;
      line-height: 1.625;
    }

    p.sub {
      font-size: 13px;
    }
    /* Utilities ------------------------------ */

    .align-right {
      text-align: right;
    }

    .align-left {
      text-align: left;
    }

    .align-center {
      text-align: center;
    }

    .u-margin-bottom-none {
      margin-bottom: 0;
    }
    /* Buttons ------------------------------ */

    .button {
      display: inline-block;
      color: #FFF;
      text-decoration: none;
      border-radius: 3px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      -webkit-text-size-adjust: none;
      box-sizing: border-box;
    }

    .button--green {
      background-color: #93c47d;
      border-top: 10px solid #93c47d;
      border-right: 18px solid #93c47d;
      border-bottom: 10px solid #93c47d;
      border-left: 18px solid #93c47d;
    }

    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
        text-align: center !important;
        font-size: 2em;
        color: white !important;
      }
    }
    /* Attribute list ------------------------------ */

    .attributes {
      margin: 0 0 21px;
    }

    .attributes_content {
      background-color: #F4F4F7;
      padding: 16px;
    }

    .attributes_item {
      padding: 0;
    }
    /* Body content ------------------------------ */

    .content-cell {
      padding: 45px;
    }
    /*Media Queries ------------------------------ */

    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #333333 !important;
        color: #FFF !important;
      }

      p,
      ul,
      ol,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .purchase_item {
        color: #FFF !important;
      }

      .attributes_content,
      .discount {
        background-color: #222 !important;
      }

      .email-masthead_name {
        text-shadow: none !important;
      }
    }

    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
  </style>
  <!--[if mso]>
      <style type="text/css">
        .f-fallback  {
          font-family: Arial, sans-serif;
          color:#fff;
        }
      </style>
    <![endif]-->
</head>
<body>
<span class="preheader">Use this link to activate your hope makers  account.</span>
<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td align="center">
      <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <!-- Email Body -->
        <tr>
          <td class="email-body" width="570" cellpadding="0" cellspacing="0">
            <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
              <!-- Body content -->
              <tr>
                <td class="content-cell">
                  <div class="f-fallback">
                    <h1>Activate Your  Hope maker Account</h1>
                    <p>Welcome to hope maker! To get started, please click the button below to activate your account.</p>
                    <!-- Action -->
                    <p>hello ${options.email}</p>
                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center">
                          <!-- Border based button -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                            <tr>
                              <td align="center">
                                <div style='color:#D9682B'class="f-fallback button button--green">${options.token
                                  .split("")
                                  .join(" - ")}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <p>If you didn't create an account with hope maker, you can safely ignore this email.</p>
                    <p>Thanks,<br>The hope makers  Team</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td class="content-cell" align="center">
                  <p class="f-fallback sub align-center">
                    HopeMakers.Online
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`,
  };

  // 3) we actaully send the email here
  await transporter.sendMail(mailOptions);
};