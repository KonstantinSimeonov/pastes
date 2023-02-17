import * as React from "react"
import {
  Alert,
  AlertProps,
  Snackbar,
  SnackbarProps,
  SnackbarCloseReason,
} from "@mui/material"

type Props = Pick<SnackbarProps, `autoHideDuration`> &
  Pick<AlertProps, `severity` | `children`>

const SnackbarContext = React.createContext<(props: Props) => void>(() => {})

export const useToast = () => React.useContext(SnackbarContext)

const anchorOrigin = { vertical: `top`, horizontal: `center` } as const

export const SnackbarProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [props, setProps] = React.useState<Props & Pick<SnackbarProps, `open`>>(
    {}
  )

  const toast = React.useCallback(
    (props: Props) => setProps({ ...props, open: true }),
    []
  )
  const hideToast = React.useCallback(
    (_: unknown, reason: SnackbarCloseReason) => {
      if (reason !== `clickaway`) setProps(p => ({ ...p, open: false }))
    },
    []
  )

  return (
    <SnackbarContext.Provider value={toast}>
      {children}
      <Snackbar
        open={props.open}
        anchorOrigin={anchorOrigin}
        onClose={hideToast}
        autoHideDuration={props.autoHideDuration || 4000}
      >
        <Alert severity={props.severity}>{props.children}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
