import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import { TYPE_VALUE_MAP, USER_TYPES } from "../../Common/constants";
import { SelectField } from "../Common/HelperInputFields";

interface ConfirmDialogProps {
  name: string;
  handleCancel: () => void;
  handleOk: (userRole: number) => void;
  currentUserType: string;
}

const styles = {
  paper: {
    "max-width": "650px",
    "min-width": "400px",
  },
};

const UserRoleSelectDialog = (
  props: ConfirmDialogProps & WithStyles<typeof styles>
) => {
  const { name, handleCancel, handleOk, classes, currentUserType } = props;

  const [userRoleFilter, setUserRoleFilter] = useState("");

  const handleSubmit = () => {
    handleOk(TYPE_VALUE_MAP[userRoleFilter]);
    setUserRoleFilter("");
  };
  return (
    <Dialog
      open={true}
      classes={{
        paper: classes.paper,
      }}
      onClose={handleCancel}
    >
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className="flex text-gray-800 leading-relaxed"
        >
          <div className="flex">
            Are you sure you want to update role for{" "}
            <p className="mx-1 font-semibold capitalize">{name}</p> ?
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <SelectField
          name="event_filter"
          variant="outlined"
          margin="dense"
          value={userRoleFilter}
          options={[
            { id: "", text: "Update User Role" },
            ...USER_TYPES.filter(
              (type) =>
                USER_TYPES.indexOf(type) < USER_TYPES.indexOf(currentUserType)
            ).map((type) => ({
              id: type,
              text: type,
            })),
          ]}
          onChange={(e: any) => {
            setUserRoleFilter(e.target.value);
            console.log(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={userRoleFilter == ""}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(UserRoleSelectDialog);
