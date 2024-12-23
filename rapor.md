# Node.js Ürün Yönetimi Uygulaması Dokümantasyonu

## Genel Bakış
Bu uygulama, Node.js ve Express ile oluşturulmuş web tabanlı bir ürün yönetim sistemidir. Resim yükleme özelliği dahil olmak üzere ürün verilerinin oluşturulması, okunması, güncellenmesi ve silinmesi için RESTful API sağlar.

## Temel Teknolojiler
Uygulama birkaç önemli teknoloji kullanmaktadır:
- **Express.js**: Web sunucusu ve API yönlendirmesini sağlar
- **MongoDB ve Mongoose**: Veri kalıcılığı ve şema yönetimini yönetir
- **Multer**: Ürün resimleri için dosya yüklemelerini yönetir
- **Body-Parser**: Gelen istek verilerini işler

## Veritabanı Mimarisi
Uygulama MongoDB'yi aşağıdaki yapıda kullanır:
- Veritabanı Adı: `test`
- Koleksiyon: `products`
- Şema:
  - `product_name` (String, zorunlu): Ürün adı
  - `product_price` (Number, zorunlu): Ürün fiyatı
  - `product_image` (String): Yüklenen ürün resminin dosya adı

## Temel Özellikler ve Uygulama

### Statik Dosya Sunumu
Uygulama iki dizinden statik dosyalar sunar:
- `public/`: Ana uygulama önyüz dosyalarını içerir
- `uploads/`: Yüklenen ürün resimlerini saklar
Bu kurulum, statik varlıkların ve yüklenen içeriğin verimli bir şekilde sunulmasını sağlar.

### Resim Yükleme İşlemi
Uygulama, Multer kullanarak sağlam bir dosya yükleme sistemi uygular:
- Eğer yoksa `uploads` dizini oluşturur
- Orijinal dosya adlarını korur
- Dosya yönetimi için uygun depolama ayarlarını yapılandırır
- Ürün oluşturma ve güncelleme işlemleriyle entegre çalışır

### API Uç Noktaları

1. **Ürün Listeleme** (GET `/api/products`)
- Veritabanından tüm ürünleri getirir
- Ürün verilerini JSON dizisi olarak döndürür
- Veritabanı işlemleri için hata yönetimi uygular

2. **Ürün Oluşturma** (POST `/api/products`)
- Çok parçalı form verisini kabul eder
- Hem ürün bilgilerini hem de resim yüklemelerini işler
- Ürün detaylarını doğrular ve MongoDB'de saklar
- Yeni oluşturulan ürün verisini döndürür

3. **Ürün Silme** (DELETE `/api/products/:name`)
- Ürünleri isme göre kaldırır
- Uygun hata yönetimi uygular
- Uygun durum kodları ve mesajları döndürür

4. **Ürün Güncelleme** (PUT `/api/products/:name`)
- Ürün bilgilerinin ve resimlerinin güncellenmesine izin verir
- Yeni resim yüklenmezse mevcut resmi korur
- Güncellemeleri doğrular ve işler
- Başarı/başarısızlık durumunu döndürür

## Güvenlik ve Hata Yönetimi
Uygulama birkaç güvenlik ve güvenilirlik özelliği uygular:
- Kimlik doğrulamalı güvenli MongoDB bağlantısı
- Genel hata yönetimi ara yazılımı
- Boyut sınırları olan istek gövdesi ayrıştırma
- Uygun dosya tipi doğrulama
- Yapılandırılmış hata yanıtları

## Uygulama Yapılandırması
- Sunucu 3000 portunda çalışır
- MongoDB bağlantısı kimlik doğrulamalı güvenli URI kullanır
- Body parser hem JSON hem de URL-encoded veriler için yapılandırılmıştır
- Statik dosya sunumu güvenlik için yapılandırılmıştır

## Uygulanan En İyi Uygulamalar
1. **Modüler Tasarım**
   - Ayrı rota işleme
   - Yapılandırılmış ara yazılım uygulaması
   - Net görev ayrımı

2. **Hata Yönetimi**
   - Kapsamlı hata yakalama
   - Detaylı hata günlüğü
   - Kullanıcı dostu hata yanıtları

3. **Kaynak Yönetimi**
   - Verimli dosya depolama
   - Uygun veritabanı bağlantı yönetimi
   - Bellek açısından verimli dosya yükleme işlemi

4. **Güvenlik Önlemleri**
   - Güvenli veritabanı kimlik bilgileri
   - Korumalı dosya yüklemeleri
   - Girdi doğrulama ve temizleme

## Geliştiriciler İçin Notlar
- MongoDB'nin düzgün yapılandırıldığından ve erişilebilir olduğundan emin olun
- Yükleme dizini izinlerini kontrol edin
- Potansiyel sorunlar için sunucu günlüklerini izleyin
- Dağıtımdan önce tüm CRUD işlemlerini test edin
- Dosya yükleme boyutu limitlerini ve tiplerini doğrulayın