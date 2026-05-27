import axios from 'axios';

const API_URL = 'https://doroob.runasp.net/api/v1'; 

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. interceptor الطلبات: حقن الـ Access Token تلقائياً
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. interceptor الاستجابة: التعامل مع انتهاء صلاحية التوكن (401)
apiClient.interceptors.response.use(
    // الميزة المضافة: إرجاع الـ data مباشرة لتبسيط الشغل في كل الـ Services
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        // إذا السيرفر رجع 401 والطلب هاد ما جربنا نعيده قبل هيك
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const oldRefreshToken = localStorage.getItem('refresh'); 
                
                if (!oldRefreshToken) {
                    throw new Error("No refresh token available");
                }

                // طلب توكن جديد باستخدام الـ Refresh Token
             const res = await axios.post(`https://doroob.runasp.net/api/v1/Auth/refresh-token`, {
                    refreshToken: oldRefreshToken
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.status === 200 || res.status === 201) {
                    // 🔍 طباعة لفحص شكل البيانات الراجعة من الـ C# بالظبط
                    console.log("الرد الراجع من الباكند لتجديد التوكن:", res.data);

                    // دعم الحالتين: سواء الباكند برجعهم CamelCase أو PascalCase
                    const accessToken = res.data.accessToken || res.data.AccessToken;
                    const refreshToken = res.data.refreshToken || res.data.RefreshToken;

                    if (!accessToken) {
                        console.error("المشكلة: الباكند لم يرسل accessToken بالشكل المتوقع!", res.data);
                        throw new Error("Unexpected API response format");
                    }

                    // حفظ التوكنز الجديدة
                    localStorage.setItem('token', accessToken);
                    if (refreshToken) {
                        localStorage.setItem('refresh', refreshToken);
                    }

                    // تحديث هيدر الطلب القديم بالتوكن الجديد
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    // إعادة تنفيذ الطلب الأصلي اللي فشل أول مرة
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("فشل تجديد التوكن، جاري التحويل لتسجيل الدخول:", refreshError);
                
                // تنظيف الـ Storage والتحويل للـ Login
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;