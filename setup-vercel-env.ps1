# PowerShell script to set Vercel environment variables
# Run this script: .\setup-vercel-env.ps1

Write-Host "Setting up Vercel environment variables..." -ForegroundColor Green

# Set RESEND_API_KEY
$apiKey = "re_VMgEmj1m_2iJDELumHDX9KqUVC9pdiaHv"
Write-Host "Adding RESEND_API_KEY..." -ForegroundColor Yellow
echo $apiKey | vercel env add RESEND_API_KEY production
echo $apiKey | vercel env add RESEND_API_KEY preview
echo $apiKey | vercel env add RESEND_API_KEY development

# Optional: Set FROM_EMAIL (using Resend test email)
$fromEmail = "onboarding@resend.dev"
Write-Host "Adding FROM_EMAIL (optional)..." -ForegroundColor Yellow
echo $fromEmail | vercel env add FROM_EMAIL production
echo $fromEmail | vercel env add FROM_EMAIL preview
echo $fromEmail | vercel env add FROM_EMAIL development

Write-Host "`nVerifying environment variables..." -ForegroundColor Green
vercel env ls

Write-Host "`n✅ Environment variables configured!" -ForegroundColor Green
Write-Host "Next step: Redeploy your project with: vercel --prod" -ForegroundColor Cyan

