import React, { useEffect, useState } from 'react'
import { Layout, PageBlock, Button, Modal, Input, Spinner, IconDelete, IconEdit, InputSearch } from 'vtex.styleguide'
import { useLazyQuery, useMutation } from 'react-apollo'
import allCookies from "./graphql/allCookies.gql"
import searchTextOfCookie from "./graphql/searchTextOfCookie.gql"
import createCookie from "./graphql/createCookie.gql"
import deleteCookie from "./graphql/deleteCookie.gql"
import ModalEdit from './ModalEdit'
import { FormattedMessage } from 'react-intl'


const AdminExample = () => {

    // Display variables
    const [searchText, setSearchText] = useState("")
    const [cookies, setCookies] = useState([])
    const [cookiesSearched, setCookiesSearched] = useState([])

    //end of display variables

    const [modal, setModal] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [idCookie, setidCookie] = useState("")
    const [textCookie, setTextCookie] = useState("")
    const [frase, setFrase] = useState("")
    const [change, setChange] = useState(false)
    // const {data} = useQuery(getAllFortuneCookie)

    //Graphql
    const [mutationCreate] = useMutation(createCookie)
    const [mutationDelete] = useMutation(deleteCookie)
    const [queryGet, { data, loading }] = useLazyQuery(allCookies, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true })
    const [querySearch, infoSearch] = useLazyQuery(searchTextOfCookie, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true, variables: { frase: searchText } })
    // end Of GraphQl

    //handles
    const HandleModal: any = () => {
        setModal(!modal)
    }
    const HandleModalEdit: any = (code: string, text: string) => {
        setidCookie(code)
        setTextCookie(text)
        setModalEdit(!modal)
    }


    const HandleSubmit: any = (e: any) => {
        e.preventDefault()
        mutationCreate({ variables: { frase }, refetchQueries: [{ query: allCookies }] })
        setFrase("")
        setChange(!change)
        HandleModal()

    }
    const HandleDelete: any = (id: string, e: any) => {
        e.preventDefault()
        console.log(id)
        mutationDelete({ variables: { id }, refetchQueries: [{ query: allCookies }] })
        setChange(!change)

    }
    // end of Handles

    useEffect(() => {
        queryGet()
    }, []);
    useEffect(() => {
        setSearchText("")
        if (data) {
            setCookies(data?.allCookies)

        }
    }, [data])
    useEffect(() => {
        if (infoSearch.data) {
            setCookiesSearched(infoSearch.data.searchTextOfCookie)
        }
    }, [infoSearch.data])
    console.log(data, "soy data")



    return (
        <Layout>
            {data ?
                <div>
                    <h1><FormattedMessage id={"admin-example.navigation.label"} /></h1>
                    <Button onClick={HandleModal}><FormattedMessage id={"admin-example.editor.add"} /></Button>
                    <InputSearch
                        placeholder="Search..."
                        value={searchText}
                        label=" "
                        size="regular"
                        onChange={(e: any) => { setSearchText(e.target.value); querySearch() }}
                        onSubmit={(e: any) => {
                            e.preventDefault()

                        }}
                    />
                    <br />
                    <Modal isOpen={modal} onClose={() => setModal(false)}>
                        <h2><FormattedMessage id={"admin-example.navigation.label"} /></h2>
                        <Input onChange={(e: any) => setFrase(e.target.value)} value={frase} placeholder="Ingresa la Frase" size="large" />
                        <div className="mt5">

                            <Button onClick={(e: any) => HandleSubmit(e)}><FormattedMessage id={"admin-example.editor.add"} /></Button>
                        </div>
                    </Modal>
                    <ModalEdit idCookie={idCookie} textCookie={textCookie} setTextCookie={setTextCookie} setChange={setChange} change={change} modalEdit={modalEdit} setModalEdit={setModalEdit} allCookies={allCookies} />
                    <div className='mt8'>
                        {(infoSearch.loading || loading) ? <Spinner /> : (searchText && cookiesSearched.length) ? cookiesSearched.map((cookie: any) =>
                            <PageBlock key={cookie.id} >
                                <div className="flex justify-between">

                                    <h3>
                                        {cookie.text}
                                    </h3>
                                    <div className='flex flex-column'>
                                        <div>
                                            <Button icon={true} onClick={() => HandleModalEdit(cookie.id, cookie.text)}><IconEdit color="white" /></Button>

                                        </div>
                                        <div className="mt3">
                                            <Button icon={true} variation={"danger"} onClick={(e: any) => HandleDelete(cookie.id, e)}><IconDelete color="white" /></Button>

                                        </div>

                                    </div>
                                </div>
                            </PageBlock>) : (searchText && !cookiesSearched.length) ? <div>
                                <h4>{<FormattedMessage id={"admin-example.editor.searchLabel"} />}.</h4>
                            </div> : data ? cookies.map((cookie: any) =>
                                <PageBlock key={cookie.id} >
                                    <div className="flex justify-between">

                                        <h3>
                                            {cookie.text}
                                        </h3>
                                        <div className='flex flex-column'>
                                            <div>
                                                <Button icon={true} onClick={() => HandleModalEdit(cookie.id, cookie.text)}><IconEdit color="white" /></Button>

                                            </div>
                                            <div className="mt3">
                                                <Button icon={true} variation={"danger"} onClick={(e: any) => HandleDelete(cookie.id, e)}><IconDelete color="white" /></Button>

                                            </div>

                                        </div>
                                    </div>
                                </PageBlock>) : null}
                    </div>
                </div>
                : loading ? <Spinner /> : <FormattedMessage id={"admin-example.editor.errorFetch"} />
            }

        </Layout>
    )
}

export default AdminExample