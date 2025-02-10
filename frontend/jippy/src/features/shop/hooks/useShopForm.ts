import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createShop } from "@/redux/slices/shopSlice";
import type { FormData, FormErrors, OCRResponse } from "@/features/shop/types/shops";
import type { RootState, AppDispatch } from "@/redux/store";

export const useShopForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const accessToken = useSelector((state: RootState) => state.user.auth.accessToken);

  const { isLoading, error } = useSelector((state: RootState) => state.shop.shop);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    openingDate: "",
    businessRegistrationNumber: "",
    representativeName: "",
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "매장 이름은 필수입니다.";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "주소는 필수입니다.";
    }
    
    const businessNumberPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!businessNumberPattern.test(formData.businessRegistrationNumber)) {
      newErrors.businessRegistrationNumber = "올바른 사업자등록번호 형식이 아닙니다.";
    }

    if (!formData.representativeName.trim()) {
      newErrors.representativeName = "대표자명은 필수입니다.";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "businessRegistrationNumber") {
      const formattedValue = value
        .replace(/[^\d]/g, "")
        .replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!validateForm()) return;

    try {
      await dispatch(createShop({
        ...formData,
        userOwnerId: Number(user.id)
      })).unwrap();
      
      alert("매장이 성공적으로 등록되었습니다");
      router.push("/shop");
    } catch (error) {
      if (error) {
        alert(error);
      }
    }
  };

  const handleOCRSuccess = (ocrResponse: OCRResponse) => {
    const { data } = ocrResponse;
    const formattedBusinessNumber = data.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
    const formattedDate = data.openDate.split(" ")[0];

    setFormData(prev => ({
      ...prev,
      name: data.corporateName,
      businessRegistrationNumber: formattedBusinessNumber,
      openingDate: formattedDate,
      representativeName: data.representativeName,
    }));
  };

  return {
    formData,
    errors: formErrors,
    isLoading,
    error,
    isProcessingImage,
    setIsProcessingImage,
    handleChange,
    handleSubmit,
    handleOCRSuccess,
  };
};