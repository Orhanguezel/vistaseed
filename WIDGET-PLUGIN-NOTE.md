# Widget Plugin Notu — Tarımİklim Hava Widget’ı

Bu proje, Tarımİklim’in embed widget’ını iframe ile tüketiyor (veya tüketmeye aday).

## Yeni ortak paket

- Paket: `@agro/ecosystem-weather-widget`
- Kaynak: `packages/ecosystem-weather-widget`
- Amaç: Widget bileşenini Tarımİklim repo’sundan bağımsız, ekosistemde yeniden kullanılabilir hale getirmek.

## Ne değişti?

- Widget bileşeni artık `apiBase` ile çalışacak şekilde paketlendi.
- Brand tokenları tek yerde: `vistaseed` dahil.

## Bu projede uygulanan güncelleme

- Native component kullanımına geçildi:
  - `@agro/ecosystem-weather-widget` dependency eklendi.
  - `WeatherWidget` kullanılıyor.
  - `brand="vistaseed"`.
  - `apiBase="/weather-widget-api"`.
- `/weather-widget-api/*` istekleri Next.js rewrite ile server-side `https://tarimiklim.com/api/v1/*` hedefine gider. Boylece browser dogrudan TarimIklim origin'ine cikmaz ve CORS riski olusmaz.
