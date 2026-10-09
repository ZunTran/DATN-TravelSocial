import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { CreateTravelPlanInput } from '../travel-plan/dto/create-travel-plan.input';

import {
  GeneratedTravelPlan,
  TravelPlanLocation,
} from './llm.types';

@Injectable()
export class LlmService {
  private readonly client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured',
      );
    }

    this.client = new GoogleGenAI({
      apiKey,
    });
  }

  async generateTravelPlan(
    input: CreateTravelPlanInput,
    locations: TravelPlanLocation[],
  ): Promise<GeneratedTravelPlan> {
    /**
     * Chuyển dữ liệu từ Hybrid Search thành dữ liệu
     * dễ hiểu cho LLM.
     *
     * Lưu ý:
     * - locationId là ID thật từ database.
     * - LLM chỉ được chọn ID trong danh sách này.
     * - description là nguồn thông tin để LLM viết
     *   lại trải nghiệm cho người dùng.
     */
    const locationData = locations.map(
      (location, index) => ({
        index: index + 1,
        locationId: location.locationId,
        name: location.name,
        address: location.address ?? null,
        description:
          location.description ?? null,
        category:
          location.category ?? null,
        estimatedCost:
          location.estimatedCost ?? 0,
        openingHours:
          location.openingHours ?? null,
      }),
    );

    const prompt = `
Bạn là AI hỗ trợ lập lịch trình du lịch.

Nhiệm vụ của bạn không chỉ là chọn địa điểm và
xếp chúng theo thời gian.

Bạn phải biến danh sách địa điểm do hệ thống tìm kiếm
được thành một lịch trình dễ đọc, tự nhiên và hữu ích
cho người đi du lịch.

==================================================
THÔNG TIN CHUYẾN ĐI
==================================================

Điểm đến:
${input.destination}

Số ngày:
${input.numberOfDays}

Tỉnh / thành phố:
${input.province ?? input.destination}

Loại địa điểm ưu tiên:
${input.category ?? 'Không yêu cầu'}

Ngân sách tối thiểu:
${input.minCost ?? 'Không yêu cầu'}

Ngân sách tối đa:
${input.maxCost ?? 'Không yêu cầu'}

Sở thích:
${(input.interests ?? []).join(', ') || 'Không yêu cầu'}

Phong cách du lịch:
${input.travelStyle ?? 'Không yêu cầu'}

Yêu cầu riêng:
${input.query ?? 'Không có'}

==================================================
CÁC ĐỊA ĐIỂM ĐÃ ĐƯỢC HỆ THỐNG TÌM THẤY
==================================================

Danh sách dưới đây là kết quả từ Hybrid Search.
Bạn CHỈ được sử dụng những địa điểm trong danh sách này.

${JSON.stringify(locationData, null, 2)}

==================================================
VAI TRÒ CỦA BẠN
==================================================

Hãy thực hiện các nhiệm vụ sau:

1. Lựa chọn những địa điểm phù hợp nhất với nhu cầu của người dùng.
2. Sắp xếp các địa điểm thành lịch trình theo từng ngày.
3. Sắp xếp thời gian hợp lý trong ngày.
4. Không cần sử dụng tất cả địa điểm được cung cấp.
5. Không nên đưa quá nhiều hoạt động vào một ngày.
6. Cân nhắc openingHours nếu dữ liệu có sẵn.
7. Cân nhắc estimatedCost khi xây dựng lịch trình.
8. Ưu tiên tạo ra một hành trình có nhịp độ tự nhiên, không quá dày đặc.
9. Nếu có khoảng thời gian nghỉ giữa các hoạt động, hãy sử dụng thời gian đó một cách tự nhiên.
10. Sau các hoạt động buổi sáng hoặc sau bữa trưa, có thể thêm khoảng nghỉ phù hợp trước khi tiếp tục hành trình buổi chiều.

==================================================
CÁCH VIẾT DESCRIPTION
==================================================

Đây là phần QUAN TRỌNG.

description không được chỉ đơn giản là sao chép
description của database.

Hãy sử dụng thông tin từ:

- tên địa điểm
- địa chỉ
- description
- category
- openingHours
- estimatedCost
- sở thích của người dùng
- yêu cầu riêng

để viết lại thành một đoạn mô tả tự nhiên dành cho người đang đi du lịch.

Mỗi description nên trả lời được một hoặc nhiều câu hỏi:

- Đến đây để làm gì?
- Có gì đáng trải nghiệm?
- Không gian hoặc điểm nổi bật là gì?
- Hoạt động này phù hợp với sở thích nào?
- Vì sao nên đặt địa điểm này ở thời điểm đó?

Ví dụ:

Thay vì:

"Thưởng thức hải sản tại nhà hàng."

Hãy viết theo phong cách:

"Bạn có thể dùng bữa trưa với các món hải sản
tại đây. Không gian phù hợp để nghỉ chân sau buổi
sáng tham quan và thưởng thức các món đặc trưng
của khu vực ven biển."

Không cần viết quá dài.
Mỗi description nên khoảng 2-4 câu.

==================================================
TẠO SỰ LIÊN KẾT GIỮA CÁC HOẠT ĐỘNG
==================================================

Lịch trình phải có cảm giác giống một hành trình thật sự thay vì một danh sách địa điểm rời rạc.

Có thể sử dụng các câu chuyển tiếp tự nhiên như:

- "Sau khi dùng bữa trưa, bạn có thể nghỉ ngơi..."
- "Buổi chiều, tiếp tục hành trình..."
- "Sau khoảng thời gian tham quan buổi sáng..."
- "Đến chiều, bạn có thể..."
- "Sau khi nghỉ ngơi, tiếp tục di chuyển..."
- "Buổi tối là thời điểm phù hợp để..."

Tuy nhiên KHÔNG được lạm dụng cùng một mẫu câu.

Nếu giữa hai hoạt động có khoảng thời gian hợp lý,
hãy phản ánh điều đó trong description của hoạt động
tiếp theo.

==================================================
THÔNG TIN DI CHUYỂN
==================================================

Nếu có thể suy luận một cách hợp lý từ địa chỉ và
bối cảnh địa điểm, có thể đề cập phương tiện phù hợp
như:

- xe máy
- taxi
- ô tô
- đi bộ

Ví dụ:

"Bạn có thể di chuyển bằng xe máy hoặc taxi từ khu
vực trung tâm."

Tuy nhiên:

- KHÔNG được tự bịa khoảng cách.
- KHÔNG được tự bịa thời gian di chuyển.
- KHÔNG được tự bịa giá taxi.
- KHÔNG được khẳng định thông tin không có trong dữ liệu.

Nếu không đủ dữ liệu thì không cần đề cập.

==================================================
CHI PHÍ
==================================================

costEstimate là chi phí ước tính của hoạt động.

Không tự tạo giá vé nếu dữ liệu không có.

Trong phần content của toàn bộ lịch trình, hãy nhắc
người dùng rằng chi phí hiển thị chỉ là chi phí ước tính
dựa trên dữ liệu hệ thống và có thể chưa bao gồm:

- phương tiện di chuyển
- vé máy bay
- vé tàu
- vé xe
- phí gửi xe
- vé tham quan nếu dữ liệu hệ thống không có
- các chi phí phát sinh khác

Không cần liệt kê tất cả nếu không phù hợp.

==================================================
LỜI KHUYÊN
==================================================

Phần content của lịch trình nên có:

1. Một đoạn giới thiệu ngắn về chuyến đi.

2. Một vài điểm nổi bật của lịch trình.

3. Gợi ý về nhịp độ chuyến đi.

4. Lưu ý về chi phí.

5. Một vài lời khuyên thực tế nếu phù hợp.

Ví dụ:

"Bạn nên chuẩn bị trang phục thoải mái và mang theo
nước khi tham quan ngoài trời."

Nhưng chỉ đưa ra lời khuyên hợp lý dựa trên lịch trình.

Không bịa thông tin cụ thể không có trong dữ liệu.

==================================================
TIME SLOT
==================================================

Mỗi hoạt động cần có timeSlot rõ ràng.

Ví dụ:

"08:00 - 10:00"
"11:30 - 13:00"
"15:00 - 17:00"

Thời gian phải có trình tự hợp lý.

Không xếp hai hoạt động chồng thời gian.

Không tạo lịch trình quá dày.

==================================================
LOCATION ID
==================================================

Đây là quy tắc BẮT BUỘC.

Chỉ được sử dụng locationId xuất hiện trong danh sách
địa điểm hệ thống cung cấp.

Không được:

- tự tạo locationId
- thay đổi locationId
- sử dụng địa điểm ngoài danh sách
- tạo địa điểm không có trong dữ liệu

==================================================
DAY INDEX
==================================================

dayIndex bắt đầu từ 1.

dayIndex không được lớn hơn:
${input.numberOfDays}

==================================================
CONTENT
==================================================

content là phần giới thiệu tổng quan cho toàn bộ
chuyến đi.

Không viết content như một câu ngắn khô khan.

Hãy viết thành một đoạn văn tự nhiên khoảng
2–4 câu.

Nội dung nên đề cập:

- chuyến đi có phong cách như thế nào
- điểm nổi bật
- cách kết hợp tham quan / ăn uống / nghỉ ngơi
- một lời khuyên hoặc lưu ý ngắn

==================================================
QUY TẮC JSON
==================================================

Chỉ trả về JSON hợp lệ.

Không markdown.

Không dùng code block.

Không thêm text bên ngoài JSON.

FORMAT:

{
  "title": "Tên lịch trình tự nhiên",
  "content": "Đoạn giới thiệu tổng quan về chuyến đi",
  "items": [
    {
      "dayIndex": 1,
      "timeSlot": "08:00 - 10:00",
      "activityName": "Tên hoạt động",
      "locationId": "ID từ danh sách",
      "description": "Mô tả trải nghiệm tự nhiên, có thể đề cập điểm nổi bật và ngữ cảnh của hoạt động",
      "costEstimate": 0
    }
  ]
}

==================================================
YÊU CẦU CUỐI CÙNG
==================================================

Hãy ưu tiên:
- tự nhiên
- dễ đọc
- giống một người đang tư vấn lịch trình
- có sự liên kết giữa các hoạt động
- có thông tin hữu ích
- không quá dài dòng
- không khô cứng như dữ liệu database

Nhưng vẫn phải tuân thủ tuyệt đối dữ liệu địa điểm được hệ thống cung cấp và các quy tắc locationId.
`;

    try {
      console.log(
        '========== GEMINI REQUEST ==========',
      );

      console.log(
        'MODEL:',
        process.env.GEMINI_MODEL,
      );

      console.log(
        'LOCATION COUNT:',
        locations.length,
      );

      console.log(
        'PROMPT LENGTH:',
        prompt.length,
      );

      const response =
        await this.client.models.generateContent({
          model:
            process.env.GEMINI_MODEL ??
            'gemini-3.5-flash-lite',

          contents: prompt,

          config: {
            responseMimeType:
              'application/json',

            temperature: 0.65,
          },
        });

      const text =
        typeof response.text === 'string'
          ? response.text
          : '';

      console.log(
        '========== GEMINI RESPONSE ==========',
      );

      console.log(text);

      if (!text) {
        throw new Error(
          'Gemini returned empty response',
        );
      }

      return this.parseJson(text);
    } catch (error: any) {
      console.error(
        '[Gemini] Error:',
        error?.message ?? error,
      );

      throw new BadGatewayException(
        `Không thể tạo lịch trình từ AI: ${
          error?.message ?? 'Unknown error'
        }`,
      );
    }
  }

  private parseJson(
    text: string,
  ): GeneratedTravelPlan {
    let cleaned = text.trim();

    if (cleaned.startsWith('```json')) {
      cleaned = cleaned
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '');
    }

    let parsed: any;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(
        'Gemini returned invalid JSON',
      );
    }

    if (
      !parsed ||
      typeof parsed !== 'object'
    ) {
      throw new Error(
        'Gemini returned invalid object',
      );
    }

    if (
      typeof parsed.title !== 'string' ||
      typeof parsed.content !== 'string' ||
      !Array.isArray(parsed.items)
    ) {
      throw new Error(
        'Gemini response has invalid structure',
      );
    }

    return {
      title: parsed.title,
      content: parsed.content,
      items: parsed.items,
    };
  }
}