import React from 'react';
import usePrediction from '@/features/dashboard/customer/hooks/usePrediction';

const categoryMapping: { [key: string]: string } = {
  "1": "서비스",
  "2": "실시간 서비스",
  "3": "제품관련",
  "4": "기타",
};

interface MLAnalysisProps {
  storeId: number;
}

const MLAnalysis: React.FC<MLAnalysisProps> = ({ storeId }) => {
  const { data, loading, error } = usePrediction(storeId);

  if (loading) return <div className="p-4">분석 데이터를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-red-500">오류: {error}</div>;
  if (!data) return null;

  return (
    <div className="p-6">
      {/* 피드백 총계 카드 */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-[#F27B39] text-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">긍정 피드백</h3>
          <p className="text-3xl font-bold">{data.positive_count}</p>
        </div>
        <div className="flex-1 bg-gray-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700">부정 피드백</h3>
          <p className="text-3xl font-bold text-gray-800">{data.negative_count}</p>
        </div>
      </div>

      {/* 긍정 / 부정 샘플 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 긍정 샘플 */}
        <div>
          <h4 className="text-2xl font-semibold mb-4">긍정 샘플</h4>
          <div className="space-y-4">
            {data.positive_samples.map((sample, idx) => (
              <div
                key={idx}
                className="border-l-4 border-green-500 bg-green-50 p-4 rounded shadow"
              >
                <p className="text-sm text-gray-500">{sample.created_at}</p>
                <p className="font-medium text-lg">
                  {categoryMapping[sample.category] || sample.category}
                </p>
                <p>{sample.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 부정 샘플 */}
        <div>
          <h4 className="text-2xl font-semibold mb-4">부정 샘플</h4>
          <div className="space-y-4">
            {data.negative_samples.map((sample, idx) => (
              <div
                key={idx}
                className="border-l-4 border-red-500 bg-red-50 p-4 rounded shadow"
              >
                <p className="text-sm text-gray-500">{sample.created_at}</p>
                <p className="font-medium text-lg">
                  {categoryMapping[sample.category] || sample.category}
                </p>
                <p>{sample.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 키워드 영역 */}
      <div className="mt-6">
        <h4 className="text-2xl font-semibold mb-2">키워드</h4>
        <div className="flex flex-wrap gap-2">
          {data.positive_keywords.map((kw, idx) => (
            <span
              key={idx}
              className="bg-[#F27B39] text-white px-3 py-1 rounded-full text-sm"
            >
              {kw}
            </span>
          ))}
          {data.negative_keywords.map((kw, idx) => (
            <span
              key={idx}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLAnalysis;
