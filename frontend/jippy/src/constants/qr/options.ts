// QR 코드 생성 시 사용되는 옵션값
export const QR_OPTIONS = {
    level: "M", // QR 코드 오류 수정 레벨
    margin: 3, // QR 코드 주변 여백
    scale: 4, // QR 코드 크기 배율
    width: 200, // QR 코드 너비
    color: {
      dark: "#000000", // QR 코드 색상
      light: "#FFFFFF", // QR 코드 배경색
    },
  } as const;