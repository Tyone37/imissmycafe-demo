@REM Maven Wrapper for Windows
@REM Tự động download Maven nếu chưa có

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET DP0=%~dp0
@SET MAVEN_PROJECTBASEDIR=%DP0%

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

@IF NOT EXIST %WRAPPER_JAR% (
  @SET JAVADIR=%JAVA_HOME%
  @IF "%JAVADIR%"=="" (
    FOR /F "tokens=*" %%i IN ('where java') DO @SET JAVADIR=%%~dpi..
  )
  "%JAVADIR%\bin\java" -cp "" org.apache.maven.wrapper.BootstrapperJar 2>NUL
  IF NOT EXIST %WRAPPER_JAR% (
    @echo Downloading Maven Wrapper JAR...
    powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile %WRAPPER_JAR% -UseBasicParsing"
  )
)

@SET MAVEN_OPTS=%MAVEN_OPTS% -Xmx512m

%JAVA_HOME%\bin\java -cp %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
