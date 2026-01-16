import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Card,
  Typography,
  Alert,
  Divider,
  message,
  ConfigProvider,
  theme,
} from "antd";
import { ExperimentOutlined, StarFilled, MoonFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

// Markdown Imports
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import "dayjs/locale/vi"; // Import locale tiếng Việt cho Dayjs
import viVN from "antd/locale/vi_VN"; // Import locale tiếng Việt cho Ant Design

// Import Styles
import "./App.css";

// Import the Chart Component
import NatalChart from "./NatalChart";

dayjs.locale("vi");

const { Title, Text } = Typography;
const { Option } = Select;

// --- Types ---
interface FormValues {
  name: string;
  gender: string;
  dob: dayjs.Dayjs;
  tob: dayjs.Dayjs;
}

interface ApiResponse {
  result: string;
}

interface ChartData {
  dob: dayjs.Dayjs;
  tob: dayjs.Dayjs;
}

// --- Component ---
const AstrologyReader: React.FC = () => {
  const [form] = Form.useForm();

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const handleFinish = async (values: FormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setChartData(null);

    try {
      // Định dạng ngày giờ chuẩn Việt Nam để hiển thị hoặc gửi đi
      const formattedDate = values.dob.format("DD/MM/YYYY");
      const formattedTime = values.tob.format("HH:mm");

      // 1. Kích hoạt vẽ biểu đồ ngay lập tức
      setChartData({ dob: values.dob, tob: values.tob });

      // 2. Tạo Prompt (Lời nhắc) cho AI bằng tiếng Việt
      const prompt = `
        Hãy đóng vai một nhà Chiêm tinh học (Astrologer) ấm áp, trực giác và huyền bí. 
        Hãy hé lộ những bí mật của bầu trời dành cho:
        - Tên: ${values.name}
        - Giới tính: ${values.gender}
        - Sinh ngày: ${formattedDate} vào lúc ${formattedTime}
        
        Vui lòng định dạng câu trả lời bằng **Markdown** (sử dụng Tiếng Việt):
        1. **Bộ ba Thiên đàng (Celestial Trinity)**: Xác định Cung Mặt Trời (Sun), Cung Mặt Trăng (Moon) và Cung Mọc (Ascendant) kèm theo mô tả ngắn gọn, thơ mộng về sự kết hợp này.
        2. **Dấu ấn Linh hồn**: Tóm tắt về tính cách cốt lõi và ánh sáng nội tâm.
        3. **Định mệnh & Trái tim**: Dự báo về con đường sự nghiệp và các mối quan hệ tình cảm.
        
        Giọng văn: Trao quyền (empowering), bí ẩn và tử tế. Sử dụng gạch đầu dòng và in đậm để dễ đọc.
      `.trim();

      // 3. Gọi API
      const response = await axios.post<ApiResponse>(
        "https://groqprompt.netlify.app/api/ai",
        { prompt: prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      // 4. Xử lý phản hồi
      if (response.data && response.data.result) {
        setResult(response.data.result);
        message.success({
          content: "Vũ trụ đã hé lộ những bí mật!",
          icon: <StarFilled style={{ color: "#ffd700" }} />,
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        "Kết nối đến các vì sao bị che khuất (Lỗi API). Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#b23eff", // Màu tím huyền bí
          fontFamily: "'Be Vietnam Pro', sans-serif",
          borderRadius: 8,
          colorBgContainer: "rgba(0, 0, 0, 0.2)", // Input bán trong suốt
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
          // Background được xử lý bởi CSS toàn cục (body)
        }}
      >
        <Card
          className="mystic-card"
          bordered={false}
          style={{ width: "100%", maxWidth: 700 }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <MoonFilled
              style={{
                fontSize: "40px",
                color: "#ffd700",
                marginBottom: "10px",
              }}
            />
            <Title level={2} className="mystic-title" style={{ margin: 0 }}>
              Chiêm Tinh Dẫn Lối
            </Title>
            <Text style={{ color: "#bfa5d6", fontSize: "16px" }}>
              Khám phá bí mật bản đồ sao của bạn
            </Text>
          </div>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ gender: "Nữ" }}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="mystic-label">Họ và tên</span>}
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
            >
              <Input
                placeholder="Ví dụ: Nguyễn Văn A"
                size="large"
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={<span className="mystic-label">Giới tính</span>}
              name="gender"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="Nữ">Nữ</Option>
                <Option value="Nam">Nam</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Form.Item
                label={<span className="mystic-label">Ngày sinh</span>}
                name="dob"
                style={{ flex: 1, minWidth: "140px" }}
                rules={[
                  { required: true, message: "Cần thiết cho Cung Mặt Trời" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                />
              </Form.Item>
              <Form.Item
                label={<span className="mystic-label">Giờ sinh</span>}
                name="tob"
                style={{ flex: 1, minWidth: "140px" }}
                rules={[{ required: true, message: "Cần thiết cho Cung Mọc" }]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="HH:mm"
                  placeholder="Chọn giờ"
                />
              </Form.Item>
            </div>

            <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="cosmic-btn"
                icon={<ExperimentOutlined />}
                style={{ height: "50px", fontSize: "18px" }}
              >
                {loading
                  ? "Đang hỏi ý kiến các vì sao..."
                  : "Khám Phá Vận Mệnh"}
              </Button>
            </Form.Item>
          </Form>

          {/* Thông báo lỗi */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{
                marginTop: "20px",
                background: "rgba(255,0,0,0.1)",
                border: "1px solid #ff4d4f",
              }}
            />
          )}

          {/* Khu vực kết quả */}
          {(result || chartData) && (
            <div style={{ marginTop: "30px", animation: "fadeIn 1s ease-in" }}>
              <Divider
                dashed
                style={{ borderColor: "#ffd700", color: "#ffd700" }}
              >
                <StarFilled /> Luận Giải Của Bạn <StarFilled />
              </Divider>

              {/* 1. Hiển thị Bản đồ sao */}
              {chartData && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <NatalChart dob={chartData.dob} tob={chartData.tob} />
                </div>
              )}

              {/* 2. Hiển thị Phân tích AI (Markdown) */}
              {result && (
                <div className="mystic-result-container">
                  <div className="mystic-markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // Custom Blockquote Styling
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="mystic-blockquote"
                            {...props}
                          />
                        ),
                        // Links styling
                        a: ({ node, ...props }) => (
                          <a
                            style={{
                              color: "#ffd700",
                              textDecoration: "underline",
                            }}
                            {...props}
                          >
                            {props.children}
                          </a>
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div
                style={{ textAlign: "center", marginTop: "20px", opacity: 0.7 }}
              >
                <Text style={{ fontSize: "12px", color: "#bfa5d6" }}>
                  * Kết quả được tạo bởi AI nhằm mục đích giải trí và tham khảo.
                </Text>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ConfigProvider>
  );
};

export default AstrologyReader;
