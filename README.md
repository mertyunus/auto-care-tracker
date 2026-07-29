# Garaj Defterim (Auto Care Tracker)

Garaj Defterim, araç sahiplerinin araçlarına ait servis geçmişlerini, yapılan işlemleri, maliyetleri ve periyodik hatırlatmaları (muayene, sigorta vb.) takip etmelerini sağlayan modern bir web uygulamasıdır. 

Uygulama, **React (Vite)** ile geliştirilmiş olup kimlik doğrulama ve veritabanı için **Firebase**, resim yükleme işlemleri için ise tamamen ücretsiz **Cloudinary** servisini kullanmaktadır.

## 🚀 Özellikler

- **Çoklu Araç Yönetimi:** Kendi garajınıza birden fazla araç (Plaka, Marka, Model, Yıl) ekleme.
- **İşlem Geçmişi:** Araçlara yapılan bakım, onarım ve diğer işlemlerin tarih, kilometre, maliyet (işçilik & parça) detaylarıyla birlikte kayıt altına alınması.
- **Masraf Analizi:** Yapılan harcamaların kategorilere (Mekanik, Elektrik, Lastik vb.) göre Recharts kullanılarak pasta grafik üzerinde gösterimi.
- **Medya Yükleme:** İşlemlere ait fatura veya servis fotoğraflarının Cloudinary altyapısıyla güvenli bir şekilde saklanması.
- **Hatırlatmalar:** Muayene, kasko, trafik sigortası veya periyodik bakım için hatırlatma ekleme.
- **PDF Raporlama:** Aracın tüm geçmişini ve masraf dökümünü tek tuşla (jsPDF ile) profesyonel bir PDF raporu olarak dışa aktarabilme.
- **Mobil Uyumlu Tasarım:** Tailwind CSS ile geliştirilmiş, telefondan da rahatça kullanılabilen (responsive) modern arayüz.

## 🛠️ Kurulum Adımları (Yerel Geliştirme)

Projeyi kendi bilgisayarınızda veya sunucunuzda çalıştırmak için aşağıdaki adımları sırasıyla takip etmeniz gerekmektedir:

### 1. Projeyi Klonlayın ve Bağımlılıkları Yükleyin

```bash
git clone https://github.com/KULLANICI_ADINIZ/auto-care-tracker.git
cd auto-care-tracker
npm install
```

### 2. Ortam Değişkenlerini (Environment Variables) Ayarlayın

Projenin kök dizininde bulunan `.env.example` dosyasının adını kopyalayarak yeni bir `.env` dosyası oluşturun:
```bash
cp .env.example .env
```

Oluşturduğunuz `.env` dosyasının içine Firebase ve Cloudinary anahtarlarınızı girmeniz gerekiyor. Aşağıdaki adımları takip edebilirsiniz.

---

### 3. Firebase Kurulumu (Veritabanı & Üyelik)

1. [Firebase Console](https://console.firebase.google.com/)'a gidin ve yeni bir proje oluşturun.
2. Proje oluşturduktan sonra, panoda bulunan **Web (`</>`)** ikonuna tıklayarak uygulamanızı kaydedin. Size verilecek olan `apiKey`, `authDomain`, `projectId` gibi değerleri `.env` dosyanızdaki `VITE_FIREBASE_...` değişkenlerine yapıştırın.
3. Firebase sol menüsünden **Build > Authentication** sekmesine gidin. "Get Started" diyerek **Email/Password** (E-posta ve Şifre) seçeneğini aktif (Enable) edin.
4. Yine sol menüden **Build > Firestore Database** sekmesine gidin. "Create database" butonuna basarak Test modunda veya Üretim modunda bir veritabanı oluşturun.
5. Veritabanı oluşturulduktan sonra üst sekmeden **Rules (Kurallar)** kısmına geçin. Bu projedeki kuralların, sadece kullanıcıların kendi verilerini görebilmesi üzerine kurgulanması önerilir. Aşağıdaki kural yapısını oraya yapıştırın ve yayınlayın:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /vehicles/{vehicleId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /records/{recordId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

### 4. Cloudinary Kurulumu (Fotoğraf Yükleme İçin)

Firebase Storage ücretsiz kotası sorun yaşatabildiği için bu projede resim yüklemeleri için Cloudinary kullanılmıştır:

1. [Cloudinary Ücretsiz Kayıt](https://cloudinary.com/) sayfasına gidin ve hesabınızı oluşturun.
2. Ana panelinizde (Dashboard) **Cloud Name** değerinizi bulun ve `.env` dosyasındaki `VITE_CLOUDINARY_CLOUD_NAME` karşılığına yazın.
3. Cloudinary ayarlarından (Settings ⚙️) **Upload** sekmesine gidin.
4. Sayfanın aşağısındaki **Upload presets** bölümünden **"Add upload preset"** butonuna basın.
5. **Signing Mode** seçeneğini kesinlikle **Unsigned** olarak seçin ve kaydedin.
6. Size verilen yeni Preset Name (örn: `ml_default`) adını kopyalayın ve `.env` dosyasındaki `VITE_CLOUDINARY_UPLOAD_PRESET` karşılığına yazın.

---

### 5. Uygulamayı Başlatın

Tüm adımları tamamladıktan ve `.env` dosyanızı kaydettikten sonra projeyi başlatabilirsiniz:

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde yayına girecektir. Tarayıcınızdan bu adrese giderek yeni bir hesap oluşturabilir ve uygulamayı kullanmaya başlayabilirsiniz!

## Teknolojiler

- **React & Vite**
- **Tailwind CSS v4**
- **Firebase v11** (Auth, Firestore)
- **Cloudinary** (Resim Saklama)
- **jsPDF & jsPDF-AutoTable**
- **Recharts** (Grafikler)
- **Lucide Icons**
- **React Hook Form & Zod** (Form Doğrulaması)
