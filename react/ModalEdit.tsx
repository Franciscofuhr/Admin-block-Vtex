import React from 'react'
import { useMutation } from 'react-apollo'
import { Button, Modal, Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'


import editCookie from "./graphql/editCookie.gql"
interface ChildProps {
    idCookie: string;
    textCookie: string;
    setChange: any;
    change: boolean;
    modalEdit: boolean;
    setModalEdit: any
    setTextCookie: any,
    allCookies: any
}
const ModalEdit: React.FC<ChildProps> = ({ idCookie, setTextCookie, textCookie, setChange, change, modalEdit, setModalEdit, allCookies }) => {



    console.log(idCookie, "id pa")
    console.log(textCookie, "text  pa")
    const [mutationEdit] = useMutation(editCookie)



    const HandleSubmit: any = () => {
        if (!textCookie) return
        console.log("entre aca", idCookie, textCookie)
        mutationEdit({ variables: { idCookie, frase: textCookie }, refetchQueries: [{ query: allCookies }] })
        setChange(!change)
        setModalEdit(false)

    }






    return (

        <Modal isOpen={modalEdit} onClose={() => setModalEdit(false)}>
            <h2><FormattedMessage id={"admin-example.editor.edit"} /> </h2>
            < Input onChange={(e: any) => setTextCookie(e.target.value)} value={textCookie} placeholder="Ingresa la Frase" size="large" />
            <div className='mt5'>
                <Button onClick={HandleSubmit}> Actualizar </Button>

            </div>
        </Modal>
    )

}
export default ModalEdit