$path = "D:\video-platform\backend\index.js"
$content = Get-Content $path -Raw

$snippet = @"
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Uploads directory created.');
}
"@

if ($content -notmatch [regex]::Escape("const fs = require('fs');")) {
    # Find position of app.listen
    $index = $content.IndexOf("app.listen")

    if ($index -gt -1) {
        $head = $content.Substring(0, $index)
        $tail = $content.Substring($index)

        $newContent = $head + "`r`n" + $snippet + "`r`n" + $tail

        Set-Content -Path $path -Value $newContent -Encoding UTF8

        Write-Host "Uploads directory creation snippet added successfully."
    }
    else {
        Write-Host "Couldn't find app.listen line. Please add snippet manually."
    }
}
else {
    Write-Host "Uploads directory snippet already exists in index.js."
}
