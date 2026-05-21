import { useEffect } from 'react';

const exactTranslations = {
  OVERVIEW: 'TỔNG QUAN',
  MONITORING: 'GIÁM SÁT',
  OPERATION: 'VẬN HÀNH - BẢO TRÌ',
  REPORTS: 'BÁO CÁO',
  MANAGEMENT: 'QUẢN LÝ HỆ THỐNG',
  Connected: 'Đã kết nối',
  Logout: 'Đăng xuất',
  'Dashboard Overview': 'Tổng quan hệ thống',
  'Realtime Monitoring': 'Giám sát thời gian thực',
  'Power Flow': 'Luồng công suất',
  'Battery Detail': 'BMS',
  'PCS Detail': 'PCS',
  'Alarm Management': 'Cảnh báo',
  'Schedule Management': 'Quản lý lịch',
  'Control Panel': 'Bảng điều khiển',
  'Energy Report': 'Báo cáo',
  'Command History': 'Lịch sử lệnh',
  'Operation Logs': 'Nhật ký thao tác',
  'User Management': 'Quản lý người dùng',
  'Parameter Settings': 'Cài đặt tham số',
  'System Settings': 'Cài đặt hệ thống',
  'BESS Dashboard': 'Bảng điều khiển BESS',
  'BESS Monitoring Dashboard': 'Bảng điều khiển giám sát BESS',
  'Welcome back': 'Chào mừng quay lại',
  'Sign in to your account': 'Đăng nhập vào tài khoản của bạn',
  Email: 'Email',
  Password: 'Mật khẩu',
  'Remember me': 'Ghi nhớ đăng nhập',
  'Forgot password?': 'Quên mật khẩu?',
  'Signing in...': 'Đang đăng nhập...',
  'Sign In': 'Đăng nhập',
  'Demo accounts:': 'Tài khoản mẫu:',
  'Open control panel': 'Mở bảng điều khiển',
  'Open reports': 'Mở báo cáo',
  'View details': 'Xem chi tiết',
  'Open alarm page': 'Mở trang cảnh báo',
  'Manage schedule': 'Quản lý lịch',
  'Open users': 'Mở quản lý người dùng',
  'Edit thresholds': 'Sửa ngưỡng',
  'View all commands': 'Xem tất cả lệnh',
  'View all logs': 'Xem tất cả nhật ký',
  'All Modes': 'Tất cả chế độ',
  'All Status': 'Tất cả trạng thái',
  'All Roles': 'Tất cả vai trò',
  'Create Schedule': 'Tạo lịch',
  Edit: 'Sửa',
  Disable: 'Tắt',
  Enable: 'Bật',
  'Edit Schedule': 'Sửa lịch',
  Cancel: 'Hủy',
  'Save Schedule': 'Lưu lịch',
  'Schedule Name': 'Tên lịch',
  Mode: 'Chế độ',
  'Start Time': 'Thời gian bắt đầu',
  'End Time': 'Thời gian kết thúc',
  'Target Power (kW)': 'Công suất mục tiêu (kW)',
  'Repeat Type': 'Kiểu lặp',
  Once: 'Một lần',
  Daily: 'Hằng ngày',
  Weekly: 'Hằng tuần',
  Monthly: 'Hằng tháng',
  'SOC Min (%)': 'SOC tối thiểu (%)',
  'SOC Max (%)': 'SOC tối đa (%)',
  'Search name or email': 'Tìm theo tên hoặc email',
  'Add User': 'Thêm người dùng',
  'User ID': 'Mã người dùng',
  'Full Name': 'Họ và tên',
  Role: 'Vai trò',
  Status: 'Trạng thái',
  'Last Login': 'Đăng nhập gần nhất',
  'Created At': 'Ngày tạo',
  Action: 'Thao tác',
  Unlock: 'Mở khóa',
  Lock: 'Khóa',
  'Edit User': 'Sửa người dùng',
  'Save User': 'Lưu người dùng',
  'Confirm Password': 'Xác nhận mật khẩu',
  Viewer: 'Người xem',
  Operator: 'Vận hành viên',
  Admin: 'Quản trị viên',
  Engineer: 'Kỹ sư',
  Active: 'Đang hoạt động',
  Inactive: 'Ngừng hoạt động',
  Locked: 'Đã khóa',
  Name: 'Tên',
  Start: 'Bắt đầu',
  End: 'Kết thúc',
  'Target Power': 'Công suất mục tiêu',
  Repeat: 'Lặp lại',
  'Created By': 'Người tạo',
  Actions: 'Thao tác',
  Charge: 'Sạc',
  Discharge: 'Xả',
  Standby: 'Chờ',
  'Peak Shaving': 'Cắt đỉnh',
  Backup: 'Dự phòng',
  Maintenance: 'Bảo trì',
  Enabled: 'Đang bật',
  Disabled: 'Đã tắt',
  Online: 'Trực tuyến',
  Offline: 'Ngoại tuyến',
  Fault: 'Lỗi',
  Normal: 'Bình thường',
  Running: 'Đang chạy',
  Charging: 'Đang sạc',
  Discharging: 'Đang xả',
  Warning: 'Cảnh báo',
  Critical: 'Nghiêm trọng',
  Disconnected: 'Mất kết nối',
  Acknowledged: 'Đã xác nhận',
  Cleared: 'Đã xóa',
  Pending: 'Đang chờ',
  Sent: 'Đã gửi',
  Accepted: 'Đã chấp nhận',
  Rejected: 'Bị từ chối',
  Failed: 'Thất bại',
  Timeout: 'Hết thời gian',
  Completed: 'Hoàn tất',
  Info: 'Thông tin',
  Success: 'Thành công',
  Auto: 'Tự động',
  Manual: 'Thủ công',
  High: 'Cao',
  Low: 'Thấp',
  Supplied: 'Đang cấp',
  Generating: 'Đang phát',
  Idle: 'Nhàn rỗi',
  Grid: 'Lưới điện',
  Battery: 'Pin',
  Load: 'Tải',
  'System Status': 'Trạng thái hệ thống',
  'State of Charge': 'Mức sạc (SOC)',
  'State of Health': 'Tình trạng pin (SOH)',
  'Battery Power': 'Công suất',
  'Available Energy': 'Năng lượng khả dụng',
  'Battery Temp': 'Nhiệt độ pin',
  'PCS AC Power': 'Công suất AC PCS',
  'BMS Status': 'Trạng thái BMS',
  'Grid Power': 'Công suất lưới',
  'PV / Load': 'PV / Tải',
  'Energy Flow': 'Luồng năng lượng',
  'Subsystem Health': 'Tình trạng phân hệ',
  'Power Trend (24h)': 'Xu hướng công suất (24h)',
  'SOC Trend (24h)': 'Xu hướng SOC (24h)',
  'Energy Report Snapshot': 'Tóm tắt báo cáo năng lượng',
  'Alarm and Event Center': 'Trung tâm cảnh báo và sự kiện',
  'Operations Workspace': 'Không gian vận hành',
  'Charge / Discharge Schedule': 'Lịch sạc / xả',
  'Users and Permissions': 'Người dùng và quyền hạn',
  'Safety and Parameter Readiness': 'Mức sẵn sàng an toàn và tham số',
  'No report data': 'Không có dữ liệu báo cáo',
  'Try another time range.': 'Hãy thử khoảng thời gian khác.',
  'Export Excel': 'Xuất Excel',
  'Export PDF': 'Xuất PDF',
  Export: 'Xuất dữ liệu',
  Time: 'Thời gian',
  User: 'Người dùng',
  Type: 'Loại',
  Reason: 'Lý do',
  'Result Message': 'Thông điệp kết quả',
  'Confirm Action': 'Xác nhận thao tác',
  Confirm: 'Xác nhận',
  Parameter: 'Tham số',
  Old: 'Cũ',
  New: 'Mới',
  'Enter reason...': 'Nhập lý do...',
  'Enter password to confirm': 'Nhập mật khẩu để xác nhận',
  'Enter password': 'Nhập mật khẩu',
  Close: 'Đóng',
  'Close modal': 'Đóng hộp thoại',
  'Open alarms': 'Mở cảnh báo',
  'Toggle navigation': 'Bật/tắt thanh điều hướng',
  'Toggle password visibility': 'Hiện/ẩn mật khẩu',
};

const inlineTranslations = {
  'BESS Site Mission Control': 'Trung tâm điều hành trạm BESS',
  'Real-time operations, alarms, reports and control in one view.': 'Vận hành thời gian thực, cảnh báo, báo cáo và điều khiển trong một màn hình.',
  'The dashboard brings together live battery storage monitoring, energy flow awareness, operator actions, scheduling and audit history for the whole BESS station.': 'Bảng điều khiển tập trung giám sát lưu trữ pin theo thời gian thực, luồng năng lượng, thao tác vận hành, lập lịch và lịch sử kiểm tra cho toàn bộ trạm BESS.',
  'Track live SOC, SOH, power and temperature values.': 'Theo dõi trực tiếp SOC, SOH, công suất và nhiệt độ.',
  'Inspect energy exchange between Grid, PV, PCS, Battery and Load.': 'Theo dõi trao đổi năng lượng giữa Lưới điện, PV, PCS, Pin và Tải.',
  'Acknowledge active alarms and review recent events.': 'Xác nhận cảnh báo đang hoạt động và xem lại các sự kiện gần đây.',
  'Open day, month and year energy analytics.': 'Mở phân tích năng lượng theo ngày, tháng và năm.',
  'Run charge, discharge and operating mode commands.': 'Thực hiện lệnh sạc, xả và chuyển chế độ vận hành.',
  'Adjust thresholds, protections and operating limits.': 'Điều chỉnh ngưỡng, bảo vệ và giới hạn vận hành.',
  'Site status': 'Trạng thái trạm',
  'Operation mode': 'Chế độ vận hành',
  'Last refresh': 'Lần cập nhật cuối',
  'Active alarms': 'Cảnh báo đang hoạt động',
  'Immediate review recommended': 'Khuyến nghị kiểm tra ngay',
  Readiness: 'Mức sẵn sàng',
  'Safety interlocks currently satisfied': 'Các liên động an toàn hiện đang được thỏa mãn',
  'Realtime Overview': 'Tổng quan thời gian thực',
  'Core KPIs for battery, power conversion and grid interaction.': 'Các KPI cốt lõi cho pin, chuyển đổi công suất và tương tác lưới điện.',
  'Live topology between Grid, PV, PCS, Battery and Load.': 'Sơ đồ kết nối trực tiếp giữa Lưới điện, PV, PCS, Pin và Tải.',
  'Operational status for key modules and interfaces.': 'Trạng thái vận hành của các mô-đun và giao diện chính.',
  'Battery, grid, PV and load power profile.': 'Biểu đồ công suất của pin, lưới, PV và tải.',
  'Charge reserve behavior across the day.': 'Diễn biến dung lượng sạc dự trữ trong ngày.',
  'Daily charge, discharge and PV production trend.': 'Xu hướng sạc, xả và sản lượng PV theo ngày.',
  'Current alarms plus latest operator-visible events.': 'Cảnh báo hiện tại cùng các sự kiện mới nhất mà người vận hành thấy được.',
  'Direct access to control, settings, schedule, permissions and audit functions.': 'Truy cập nhanh đến điều khiển, cài đặt, lịch, phân quyền và chức năng kiểm tra.',
  'Enabled schedules queued for operation.': 'Các lịch đang bật đã được xếp hàng để vận hành.',
  'Access control and role coverage.': 'Kiểm soát truy cập và phạm vi vai trò.',
  'Operating thresholds and interlock summary.': 'Tóm tắt ngưỡng vận hành và liên động.',
  'Latest control commands sent to the system.': 'Các lệnh điều khiển mới nhất đã gửi tới hệ thống.',
  'Recent user actions and system audit records.': 'Các thao tác người dùng gần đây và bản ghi kiểm tra hệ thống.',
  'View day / month / year': 'Xem ngày / tháng / năm',
  'Consumption demand': 'Nhu cầu tiêu thụ',
  'to PCS': 'đến PCS',
  'to Load': 'đến Tải',
  'AC bus': 'Thanh cái AC',
  'DC bus': 'Thanh cái DC',
  'efficiency': 'hiệu suất',
  'eff.': 'hiệu suất',
  'Export ': 'Xuất ',
  'Import ': 'Nhập ',
  'Idle 0 kW': 'Nhàn rỗi 0 kW',
  'Power â‰¤ Rated': 'Công suất ≤ định mức',
  'Táº¡o lá»‹ch sáº¡c, xáº£, standby, backup, peak shaving vÃ  maintenance.': 'Tạo lịch sạc, xả, chờ, dự phòng, cắt đỉnh và bảo trì.',
  'Quáº£n lÃ½ tÃ i khoáº£n, role, tráº¡ng thÃ¡i vÃ  hÃ nh Ä‘á»™ng reset password.': 'Quản lý tài khoản, vai trò, trạng thái và thao tác đặt lại mật khẩu.',
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function translateText(input) {
  if (!input || typeof input !== 'string') return input;

  const leading = input.match(/^\s*/)?.[0] || '';
  const trailing = input.match(/\s*$/)?.[0] || '';
  const trimmed = input.trim();

  if (exactTranslations[trimmed]) {
    return `${leading}${exactTranslations[trimmed]}${trailing}`;
  }

  let output = input;
  Object.entries(inlineTranslations)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([source, target]) => {
      output = output.replace(new RegExp(escapeRegExp(source), 'g'), target);
    });

  return output;
}

function localizeElement(root) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parentTag = node.parentElement?.tagName;
      if (['SCRIPT', 'STYLE', 'CODE'].includes(parentTag)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const translated = translateText(node.nodeValue);
    if (translated !== node.nodeValue) {
      node.nodeValue = translated;
    }
  });

  root.querySelectorAll?.('*').forEach((element) => {
    ['placeholder', 'title', 'aria-label'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      const translated = translateText(value);
      if (translated !== value) {
        element.setAttribute(attribute, translated);
      }
    });
  });
}

export function VietnameseLocalization() {
  useEffect(() => {
    document.documentElement.lang = 'vi';
    localizeElement(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' && mutation.target.parentElement) {
          localizeElement(mutation.target.parentElement);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            localizeElement(node.parentElement);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            localizeElement(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
