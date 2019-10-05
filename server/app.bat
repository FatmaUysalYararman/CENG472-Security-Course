@chdir ?\server\CLIENTDEVELOPMENT
call npm run build
@XCOPY ?\server\CLIENTDEVELOPMENT\dist\* ?\server\client /s /i /y