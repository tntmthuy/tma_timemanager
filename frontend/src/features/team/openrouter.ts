// src\features\team\openrouter.ts
export const fetchSubtaskSuggestions = async (
  taskTitle: string,
  taskDescription?: string
): Promise<string[]> => {

  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log("🧠 Prompt gửi đi:", `Dựa trên tiêu đề: "${taskTitle}" và mô tả: "${taskDescription}"...`);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`, // API key
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "TimeSphere"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-30b-a3b:free",
        messages: [
          {
            role: "user",
            content: `Dựa trên tiêu đề: "${taskTitle}" và mô tả: "${taskDescription}", hãy liệt kê tối đa 8 subtask cụ thể cần thực hiện. Trả về định dạng danh sách: "- [nội dung]". Không thêm tiêu đề, mở bài hay giải thích.`
          }
        ]
      })
    });

    const data = await response.json();

    const raw = data?.choices?.[0]?.message?.content || "";

    return raw
      .split("\n")
      .filter((line: string) => line.trim())
      .map((line: string) => {
        // Loại bỏ đầu dòng như "- ", "• ", "1. ", v.v.
        const cleaned = line.replace(/^[-•\d]+[.)]?\s*/, "").trim();
        const match = cleaned.match(/\[(.*?)\]/);
        return match ? match[1].trim() : cleaned;
      });
  } catch (err) {
    console.error("Lỗi gọi OpenRouter:", err);
    return [];
  }
};