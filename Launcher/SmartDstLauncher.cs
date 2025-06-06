using System.Diagnostics;
using System.Web;
// 添加Windows原生API支持
using System.Runtime.InteropServices;
using System;
using System.IO;

class Program
{
    [DllImport("kernel32.dll")]
    static extern IntPtr GetConsoleWindow();

    [DllImport("user32.dll")]
    static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    const int SW_HIDE = 0; // 隐藏窗口
    static (string, string) NormalizePathAndArgs(string rawPath)
    {
        // 优化协议头处理
        string pathAndQuery = rawPath.StartsWith("smartdstlauncher://", StringComparison.OrdinalIgnoreCase)
            ? rawPath["smartdstlauncher://".Length..]
            : rawPath;

        string decoded = HttpUtility.UrlDecode(pathAndQuery);

        // 优化参数分离逻辑
        int paramIndex = decoded.IndexOf('?');
        string exePath = paramIndex >= 0 ? decoded[..paramIndex] : decoded;
        string arguments = paramIndex >= 0 ? decoded[(paramIndex + 1)..] : "";

        // 4. 强化路径标准化 (关键修复)
        exePath = exePath
            .Replace('/', '\\')          // 统一分隔符
            .Replace("%2F", "")            // 移除编码的斜杠 (不再替换为$
            .Replace("%2f", "")           // 移除小写编码
            .Replace("%3A", ":")          // 处理驱动器号编码
            .TrimEnd('\\', '/')           // 移除末尾分隔符
            .Trim();                      // 移除额外空格

        return (exePath, arguments);
    }

    static void Main(string[] args)
    {
        // 启动时立即隐藏控制台窗口
        var handle = GetConsoleWindow();
        ShowWindow(handle, SW_HIDE);

        if (args.Length == 0) return;
        string url = args[0];
        try
        {
            (string exePath, string arguments) = NormalizePathAndArgs(url);

            // 添加路径验证
            if (!File.Exists(exePath))
            {
                // Console.WriteLine($"错误：目标文件不存在 - {exePath}");
                return;
            }

            // 获取工作目录（修复核心问题）
            string workingDir = Path.GetDirectoryName(exePath)!;

            // 验证工作目录有效性
            if (string.IsNullOrEmpty(workingDir) || !Directory.Exists(workingDir))
            {
                // Console.WriteLine($"错误：无效的工作目录 - {workingDir}");
                return;
            }

            // 添加调试日志
            // Console.WriteLine($"启动路径: {exePath}");
            // Console.WriteLine($"工作目录: {workingDir}");
            // Console.WriteLine($"参数: {arguments}");

            // 启动进程
            var process = new Process();
            process.StartInfo.FileName = exePath;
            process.StartInfo.Arguments = arguments;
            process.StartInfo.WorkingDirectory = workingDir;
            // 隐藏窗口
            process.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            process.StartInfo.CreateNoWindow = true;

            // 启用Shell执行（处理UAC提权）
            process.StartInfo.UseShellExecute = true;

            process.Start();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"启动失败: {ex.Message}");
            Console.WriteLine($"堆栈跟踪: {ex.StackTrace}");
        }
    }
}
