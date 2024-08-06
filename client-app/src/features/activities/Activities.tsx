import { useEffect } from "react";
import { useStore } from "../../stores/store"
import { observer } from "mobx-react-lite";


const Activities = () => {

  const { activityStore } = useStore();
  const { loadActivities } = activityStore;

  useEffect(() => {
    loadActivities();
}, [loadActivities])

  return (
    <></>
  )
}

export default observer(Activities);
