import { useState, useEffect } from 'react';

const BASE = 'https://provinces.open-api.vn/api';

export function useVietnamAddress() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards,     setWards]     = useState([]);

  const [province, setProvinceCode] = useState('');
  const [district, setDistrictCode] = useState('');
  const [ward,     setWardCode]     = useState('');

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards,     setLoadingWards]     = useState(false);

  /* Load tỉnh/thành khi mount */
  useEffect(() => {
    setLoadingProvinces(true);
    fetch(`${BASE}/p/`)
      .then(r => r.json())
      .then(data => setProvinces(data))
      .catch(() => setProvinces([]))
      .finally(() => setLoadingProvinces(false));
  }, []);

  /* Load quận/huyện khi chọn tỉnh */
  useEffect(() => {
    if (!province) { setDistricts([]); setWards([]); setDistrictCode(''); setWardCode(''); return; }
    setLoadingDistricts(true);
    setDistricts([]); setWards([]); setDistrictCode(''); setWardCode('');
    fetch(`${BASE}/p/${province}?depth=2`)
      .then(r => r.json())
      .then(data => setDistricts(data.districts || []))
      .catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, [province]);

  /* Load phường/xã khi chọn quận */
  useEffect(() => {
    if (!district) { setWards([]); setWardCode(''); return; }
    setLoadingWards(true);
    setWards([]); setWardCode('');
    fetch(`${BASE}/d/${district}?depth=2`)
      .then(r => r.json())
      .then(data => setWards(data.wards || []))
      .catch(() => setWards([]))
      .finally(() => setLoadingWards(false));
  }, [district]);

  /* Tên hiển thị */
  const provinceName = provinces.find(p => String(p.code) === String(province))?.name || '';
  const districtName = districts.find(d => String(d.code) === String(district))?.name || '';
  const wardName     = wards.find(w => String(w.code) === String(ward))?.name || '';

  const setAddressByCodes = async (pCode, dCode, wCode) => {
    if (!pCode) return;
    setProvinceCode(pCode);
    setLoadingDistricts(true);
    try {
      const resP = await fetch(`${BASE}/p/${pCode}?depth=2`);
      const dataP = await resP.json();
      setDistricts(dataP.districts || []);
      setDistrictCode(dCode);

      if (dCode) {
        setLoadingWards(true);
        const resD = await fetch(`${BASE}/d/${dCode}?depth=2`);
        const dataD = await resD.json();
        setWards(dataD.wards || []);
        setWardCode(wCode);
      }
    } catch (e) {
      console.error("Failed to load address by codes", e);
    } finally {
      setLoadingDistricts(false);
      setLoadingWards(false);
    }
  };
 
  return {
    provinces, districts, wards,
    province, district, ward,
    provinceName, districtName, wardName,
    setProvince: setProvinceCode,
    setDistrict: setDistrictCode,
    setWard:     setWardCode,
    setAddressByCodes,
    loadingProvinces, loadingDistricts, loadingWards,
  };
}
