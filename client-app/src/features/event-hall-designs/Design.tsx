import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useStore } from "../../stores/store"; // MobX store'u kullanıyoruz
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router";
import { Seat } from "../../models/seat";
import axios from "axios"; // API çağrıları için axios

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
  
    if (existingSeat && existingSeat.label) {
      const updatedSeats = seats.map((seat) => 
        seat.row === row && seat.column === column
          ? { ...seat, label: "", status: "Available" } // Koltuk adı ve durumu sıfırlanıyor
          : seat
      );
      setSeats(updatedSeats);
      form.resetFields(); 
    } else {
      setSelectedSeat(
        existingSeat || {
          id: '', 
          eventHallId: id, 
          row,
          column,
          label: "",
          status: "Available",
        }
      );
      form.setFieldsValue(
        existingSeat || { row, column, label: "", status: "Available" }
      );
    }
  };

  const onFinish = (values: Seat) => {
    const existingSeatIndex = seats.findIndex(
      (seat) => seat.row === values.row && seat.column === values.column
    );

    const updatedSeats = [...seats];
    if (existingSeatIndex > -1) {
      updatedSeats[existingSeatIndex] = { ...values, status: "Booked" }; // Status "Booked" yapılıyor
    } else {
      updatedSeats.push({ ...values, status: "Booked" }); // Yeni eklenen koltukta da "Booked" yapılıyor
    }

    setSeats(updatedSeats);
    setSelectedSeat(null);
    form.resetFields();
  };

  const saveLayout = async () => {
    try {
      await axios.post('/seats/save', {
        eventHallId: id,
        seats: seats.map(seat => ({
          row: seat.row,
          column: seat.column,
          label: seat.label,
          status: seat.status
        }))
      });
      alert('Koltuk düzeni kaydedildi.');
    } catch (error) {
      console.error('Koltuk düzeni kaydetme hatası:', error);
    }
  };

  if (!selectedEventHall) {
    return <div>Salon bilgileri yükleniyor...</div>;
  }

  return (
    <div>
      <h2 className="text-xs">{selectedEventHall.title} Koltuk Düzeni</h2>

      {selectedSeat && (
        <Form form={form} onFinish={onFinish} layout="inline" style={{ marginBottom: 20 }}>
          <Form.Item name="row">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="column">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Koltuk Adı"
            name="label"  // 'label' form alanı
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${selectedEventHall.columns}, 1fr)`, 
          gap: "5px", 
          width: "100%", 
          maxWidth: "1000px",
          margin: "0 auto",
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
                  width: "100%", 
                  height: "0",
                  paddingBottom: "100%", 
                  border: "0.5px solid lightgray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isSelected
                    ? "lightblue" // Seçilen koltuk
                    : seat?.status === "Booked"
                    ? "lightgreen" // Rezerve edilmiş koltuk
                    : "white", // Boş koltuk
                  cursor: "pointer",
                  position: "relative", 
                }}
                onClick={() => handleSeatClick(rowIndex, columnIndex)}
              >
                <span
                  style={{
                    position: "absolute", 
                    top: "50%", 
                    left: "50%",
                    transform: "translate(-50%, -50%)", 
                    textAlign: "center",
                  }}
                >
                  {seat?.label || ""}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        

        {seats.length > 0 ? (
          <ul>
            {seats.map((seat, index) => (
               seat.status === "Booked" && 
              <li key={index}>
                {`Koltuk: ${seat.label}, Satır: ${(seat.row) + 1}, Sütun: ${(seat.column) + 1}`}
              </li>
              
            ))}
          </ul>
        ) : (
          <p>Henüz koltuk seçilmedi.</p>
        )}
        <Button type="primary" onClick={saveLayout}>
          Düzeni Kaydet
        </Button>
      </div>
    </div>
  );
};

export default observer(Design);
