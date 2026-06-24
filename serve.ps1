# Minimal static file server for the ProLedge launching-soon site.
# Usage:  powershell -ExecutionPolicy Bypass -File serve.ps1
# Then open http://localhost:5501/

$port = 5501
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "ProLedge launching-soon served at http://localhost:$port/  (Ctrl+C to stop)"

$mimeMap = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.ico'  = 'image/x-icon'
    '.json' = 'application/json'
    '.webmanifest' = 'application/manifest+json'
    '.xml'  = 'application/xml'
    '.txt'  = 'text/plain; charset=utf-8'
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $resp = $ctx.Response
    try {
        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ($localPath -eq '') { $localPath = 'index.html' }
        $file = Join-Path $root $localPath

        if (-not (Test-Path $file -PathType Leaf)) {
            # Serve branded 404 page
            $resp.StatusCode = 404
            $file = Join-Path $root '404.html'
        }

        if (Test-Path $file -PathType Leaf) {
            $ext  = [IO.Path]::GetExtension($file).ToLower()
            $resp.ContentType = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { 'application/octet-stream' }
            $fs = [IO.File]::OpenRead($file)
            try { $resp.ContentLength64 = $fs.Length; $fs.CopyTo($resp.OutputStream) }
            finally { $fs.Close() }
        } else {
            $resp.StatusCode = 404
            $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $resp.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        # keep the server alive on per-request errors
    } finally {
        try { $resp.Close() } catch {}
    }
}
