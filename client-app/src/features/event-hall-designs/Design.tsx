import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { store, useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router";
import { Seat } from "../../models/seat";
import axios from "axios";
import { router } from "../../routes/Routes";

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
    const fetchEventHallAndSeats = async () => {
      await loadEventHallById(id); 
      fetchSeats(id); 
    };

    fetchEventHallAndSeats();
  }, [loadEventHallById, id]);

  const fetchSeats = async (eventHallId: string) => {
    try {
      const response = await axios.get(`/seats/${eventHallId}`);
      const fetchedSeats = response.data;
  
      if (fetchedSeats.length === 0) {
        const defaultSeats = Array.from({ length: selectedEventHall?.rows || 0 }, (_, rowIndex) =>
          Array.from({ length: selectedEventHall?.columns || 0 }, (_, columnIndex) => ({
            id: '', 
            eventHallId: eventHallId, 
            row: rowIndex,
            column: columnIndex,
            label: "",
            status: "Available"
          }))
        ).flat();
        setSeats(defaultSeats);
      } else {
        setSeats(fetchedSeats);
      }
    } catch (error) {
      console.error('Koltukları yükleme hatası:', error);
    }
  };
  

  const handleSeatClick = (row: number, column: number) => {
    const existingSeat = seats.find((seat) => seat.row === row && seat.column === column);
  
    if (existingSeat && existingSeat.label) {
      const updatedSeats = seats.map((seat) => 
        seat.row === row && seat.column === column
          ? { ...seat, label: "", status: "Available" } 
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
      updatedSeats[existingSeatIndex] = { ...values, status: "Booked" }; 
    } else {
      updatedSeats.push({ ...values, status: "Booked" }); 
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
      store.notificationStore.openNotification("success", "Salon düzeni başarıyla oluşturuldu!", "");
      router.navigate("/salon-tasarimlari");
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
            name="label" 
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
                    ? "lightblue" 
                    : seat?.status === "Booked"
                    ? "lightgreen" 
                    : "white", 
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
