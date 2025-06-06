// LauncherProxy.cpp
#include <Windows.h>
#include <cstdio>

extern "C" __declspec(dllexport) BOOL APIENTRY RunEntryPoint(
    HWND hwnd, HINSTANCE hinst, LPSTR lpszCmdLine, int nCmdShow)
{
    STARTUPINFOW si = {sizeof(si)}; // 明确使用宽字符版本结构体
    PROCESS_INFORMATION pi;

    // 构造命令行（包含原始协议参数）
    wchar_t cmd[MAX_PATH + 100];
    // 由于 cmd 是 wchar_t 数组，需要使用 swprintf_s 来处理宽字符字符串
    // 关键修改点：
    swprintf_s(cmd, L"\"D:\\...\\SmartDstLauncher.exe\" \"%S\"", lpszCmdLine);
    
    // 新增进程创建标志
    DWORD flags = CREATE_NO_WINDOW | DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP;
    
    // 完善窗口隐藏配置
    si.dwFlags = STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;
    si.wShowWindow = SW_HIDE;
    si.hStdOutput = GetStdHandle(STD_OUTPUT_HANDLE);

    CreateProcessW(NULL, cmd, NULL, NULL, FALSE, flags, NULL, NULL, &si, &pi);

    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);
    return TRUE;
}

// DLL入口点
BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved)
{
    return TRUE;
}
