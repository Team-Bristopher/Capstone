using System;

namespace capstone_api.Helpers
{
	/// <summary>
	/// Global helpers class for functions that we might
	/// need across the entire API domain.
	/// </summary>
	public static class Helpers
	{
		/// <summary>
		/// Verifies that a string passed in is not null
		/// or empty.
		/// </summary>
		/// <param name="_string">The string to verify.</param>
		/// <param name="variableName">The developer-given name of the variable.</param>
		/// <exception cref="Exception">Will be thrown if the variable is null or empty.</exception>
		public static void VerifyIsNotNull(string _string, string variableName)
		{
			if (String.IsNullOrWhiteSpace(_string))
			{
				throw new Exception($"{variableName} cannot be null or empty.");
			}
		}

		/// <summary>
		/// Returns the HTML used for recovery code emails
		/// as a string to send in the email.
		/// </summary>
		/// <param name="recoveryCode">The recovery code to user.</param>
		/// <returns>The HTML with the recovery code.</returns>
		public static string GetRecoveryCodeEmailHTML(string recoveryCode)
		{
			string html = $@"
				<!doctype html>
				<html xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
				<head>
					<title></title>
					<!--[if !mso]><!-->
					<meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
					<!--<![endif]-->
					<meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"">
					<meta name=""viewport"" content=""width=device-width,initial-scale=1"">
					<style type=""text/css"">
					#outlook a {{
						padding: 0;
					}}
	
					body {{
						margin: 0;
						padding: 0;
						-webkit-text-size-adjust: 100%;
						-ms-text-size-adjust: 100%;
					}}
	
					table,
					td {{
						border-collapse: collapse;
						mso-table-lspace: 0pt;
						mso-table-rspace: 0pt;
					}}
	
					img {{
						border: 0;
						height: auto;
						line-height: 100%;
						outline: none;
						text-decoration: none;
						-ms-interpolation-mode: bicubic;
					}}
	
					p {{
						display: block;
						margin: 13px 0;
					}}
					</style>
					<!--[if mso]>
						<noscript>
						<xml>
						<o:OfficeDocumentSettings>
						  <o:AllowPNG/>
						  <o:PixelsPerInch>96</o:PixelsPerInch>
						</o:OfficeDocumentSettings>
						</xml>
						</noscript>
						<![endif]-->
					<!--[if lte mso 11]>
						<style type=""text/css"">
						  .mj-outlook-group-fix {{ width:100% !important; }}
						</style>
						<![endif]-->
					<!--[if !mso]><!-->
					<link href=""https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"" rel=""stylesheet"" type=""text/css"">
					<style type=""text/css"">
					@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
					</style>
					<!--<![endif]-->
					<style type=""text/css"">
					@media only screen and (min-width:480px) {{
						.mj-column-per-100 {{
							width: 100% !important;
							max-width: 100%;
						}}
					}}
					</style>
					<style media=""screen and (min-width:480px)"">
					.moz-text-html .mj-column-per-100 {{
						width: 100% !important;
						max-width: 100%;
					}}
					</style>
					<style type=""text/css""></style>
				</head>
				<body style=""word-spacing:normal;background-color:#F4F4F4;"">
					<div style=""background-color:#F4F4F4;"">
						<!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" style=""width:600px;"" width=""600"" bgcolor=""#000000"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]-->
						<div style=""background:#000000;background-color:#000000;margin:0px auto;max-width:600px;"">
							<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#000000;background-color:#000000;width:100%;"">
								<tbody>
									<tr>
										<td style=""direction:ltr;font-size:0px;padding:20px 0;text-align:center;"">
											<!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]-->
											<div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"">
												<table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""vertical-align:top;"" width=""100%"">
													<tbody>
														<tr>
															<td align=""center"" style=""font-size:0px;padding:10px 25px;word-break:break-word;"">
																<div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;line-height:1;text-align:center;color:#D9D9D9;"">Project ROME</div>
															</td>
														</tr>
														<tr>
															<td align=""left"" style=""font-size:0px;padding:10px 25px;padding-top:5px;padding-bottom:0px;word-break:break-word;"">
																<div style=""font-family:Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;color:#55575d;"">
																	<p style=""line-height: 16px; text-align: center; margin: 10px 0; font-size: 15px; color: #ffffff"">We received a request to reset the password for your account. Please use the code below to reset your password.</p>
																	<p style=""line-height: 16px; text-align: center; margin: 10px 0; font-size: 15px; color: #ffffff;"">If you did not request this reset, please ignore this email.</p>
																</div>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
											<!--[if mso | IE]></td></tr></table><![endif]-->
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" style=""width:600px;"" width=""600"" bgcolor=""#000000"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]-->
						<div style=""background:#000000;background-color:#000000;margin:0px auto;max-width:600px;"">
							<table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#000000;background-color:#000000;width:100%;"">
								<tbody>
									<tr>
										<td style=""direction:ltr;font-size:0px;padding:0 0 0 0;padding-bottom:40px;text-align:center;"">
											<!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]-->
											<div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"">
												<table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""vertical-align:top;"" width=""100%"">
													<tbody>
														<tr>
															<td align=""center"" style=""font-size:0px;padding:10px 25px;word-break:break-word;"">
																<div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:25px;line-height:1;text-align:center;color:#D90429;"">{recoveryCode}</div>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
											<!--[if mso | IE]></td></tr></table><![endif]-->
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<!--[if mso | IE]></td></tr></table><![endif]-->
					</div>
				</body>
				</html>
			";

			return html;
		}
	}
}

