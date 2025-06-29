import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { closeFeedback } from "@src/store/FeedbackSlice.ts";

function Feedback() {
  const { message, type } = useAppSelector((state) => state.feedback);
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeFeedback());

  return (
    <Snackbar open={!!message} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Feedback;
