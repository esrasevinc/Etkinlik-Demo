import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useStore } from "../../stores/store"; // MobX store'u kullanıyoruz
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router";

interface Seat {
  row: number;
  column: number;
  name: string;
}

const Design = () => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [form] = Form.useForm();
  const { eventHallStore } = useStore();
  const { selectedEventHall, loadEventHallById } = eventHallStore;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "";

  useEffect(() => {
    const fetchEventHall = async () => {
      await loadEventHallById(id);
    };

    fetchEventHall();
  }, [loadEventHallById, id]);

  const handleSeatClick = (row: number, column: number) => {
    const existingSeat = seats.find((seat) => seat.row === row && seat.column === column);

    // Eğer koltuk mevcutsa ve bir isim atanmışsa, boş koltuk yap
    if (existingSeat && existingSeat.name) {
      const updatedSeats = seats.filter((seat) => !(seat.row === row && seat.column === column)); // Koltuğu sil
      setSeats(updatedSeats);
      form.resetFields(); // Formu sıfırla
    } else {
      // Koltuk boşsa ya da seçilmemişse, koltuk seçimini yap
      setSelectedSeat(existingSeat || { row, column, name: "" });
      form.setFieldsValue(existingSeat || { row, column, name: "" });
    }
  };

  const onFinish = (values: Seat) => {
    const existingSeatIndex = seats.findIndex(
      (seat) => seat.row === values.row && seat.column === values.column
    );

    const updatedSeats = [...seats];
    if (existingSeatIndex > -1) {
      updatedSeats[existingSeatIndex] = values;
    } else {
      updatedSeats.push(values);
    }

    setSeats(updatedSeats);
    setSelectedSeat(null);
    form.resetFields();
  };

  if (!selectedEventHall) {
    return <div>Salon bilgileri yükleniyor...</div>;
  }

  return (
    <div>
      <h2 className="text-xs">{selectedEventHall.title} Koltuk Düzeni</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${selectedEventHall.columns}, 1fr)`, // Kolonlar eşit genişlikte olur
          gap: "5px", // Hücreler arasında boşluk
          width: "100%", // Grid'in genişliği ekran genişliğine göre ayarlanır
          maxWidth: "1000px", // Maksimum genişlik sınırlaması, ekran genişliğini taşmasın
          margin: "0 auto", // Ortalıyoruz
        }}
      >
        {Array.from({ length: selectedEventHall.rows }).map((_, rowIndex) =>
          Array.from({ length: selectedEventHall.columns }).map((_, columnIndex) => {
            const isSelected =
              selectedSeat?.row === rowIndex && selectedSeat?.column === columnIndex;
            const seat = seats.find(
              (seat) => seat.row === rowIndex && seat.column === columnIndex
            );

            return (
              <div
                key={`${rowIndex}-${columnIndex}`}
                style={{
                  width: "100%", // Koltuğun genişliği hücre sayısına göre esneklik sağlar
                  height: "0", // Yüksekliği padding ile ayarlayacağız
                  paddingBottom: "100%", // Kare şeklinde hücreler yaratır
                  border: "0.5px solid lightgray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isSelected ? "lightblue" : seat ? "lightgreen" : "white",
                  cursor: "pointer",
                  position: "relative", // Pozisyonu relative yapıyoruz
                }}
                onClick={() => handleSeatClick(rowIndex, columnIndex)}
              >
                <span
                  style={{
                    position: "absolute", // Tam ortalamak için absolute pozisyon
                    top: "50%", // Yükseklik ortalaması
                    left: "50%", // Yatay ortalaması
                    transform: "translate(-50%, -50%)", // Merkezleme
                    textAlign: "center",
                  }}
                >
                  {seat?.name || ""}
                </span>
              </div>
            );
          })
        )}
      </div>

      {selectedSeat && (
        <Form form={form} onFinish={onFinish} layout="inline" style={{ marginTop: 20 }}>
          <Form.Item name="row">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="column">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Koltuk Adı"
            name="name"
            rules={[{ required: true, message: "Koltuk adı giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Koltuklar</h3>
        {seats.length > 0 ? (
          <ul>
            {seats.map((seat, index) => (
              <li key={index}>
                {`Koltuk: ${seat.name}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz koltuk seçilmedi.</p>
        )}
      </div>
    </div>
  );
};

export default observer(Design);
