import { Button } from "antd"
import { useEffect, useState } from "react"
import { IoMdAdd } from "react-icons/io"
import CreateThueGame from "./CreateThueGame"
import { getOneLienHe, getOneThueGame } from "../../../services/thueGameLienHeAPI"
import CreateLienHe from "./CreateLienHe"
import { FaRegEdit } from "react-icons/fa"
import UpdateThueGame from "./UpdateThueGame"
import UpdateLienHe from "./UpdateLienHe"

const ThueGameVaLienHe = () => {

    const [openCreateThueGame, setOpenCreateThueGame] = useState(false)
    const [openUpdateThueGame, setOpenUpdateThueGame] = useState(false)
    const [dataUpdateThueGame, setDataUpdateThueGame] = useState(false)
    const [dataThueGame, setDataThueGame] = useState(null)

    const [openCreateLienHe, setOpenCreateLienHe] = useState(false)
    const [openUpdateLienHe, setOpenUpdateLienHe] = useState(false)
    const [dataUpdateLienHe, setDataUpdateLienHe] = useState(false)
    const [dataLienHe, setDataLienHe] = useState(null)

    const fetchOneThueGames = async () => {
        const res = await getOneThueGame()
        if(res && res.data) {
            setDataThueGame(res.data)
        }
    }

    const fetchOneLienHes = async () => {
        const res = await getOneLienHe()
        if(res && res.data) {
            setDataLienHe(res.data)
        }
    }

    useEffect(() => {
        fetchOneThueGames()
        fetchOneLienHes()
    }, [])



    return (
        <>
        <div className="row mt-4">    
            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex"}}> 
                    {
                        dataThueGame && dataThueGame._id ? <>
                            <Button size='large' type="primary" onClick={() => setOpenUpdateThueGame(true)} icon={<FaRegEdit size={22} />}>Chỉnh sửa nội dung thuê game </Button>
                        </> : <>
                            <Button size='large' type="primary" onClick={() => setOpenCreateThueGame(true)} icon={<IoMdAdd size={22} />}>Tạo nội dung thuê game </Button>
                        </>
                    }                       
                </div>
                <div className="card-body p-3">
                    <div className="chart">
                        <h6>Đây là nội dung của trang thuê game</h6>
                        <div className="row mt-1 card-body p-4" style={{border: "1px solid #f0f0f0", borderRadius: "10px"}}>
                            <div  dangerouslySetInnerHTML={{ __html: dataThueGame?.text }} />
                        </div>
                    </div>
                </div>

                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex"}}> 
                    {
                        dataLienHe && dataLienHe._id ? <>
                            <Button size='large' type="primary" onClick={() => setOpenUpdateLienHe(true)} icon={<FaRegEdit size={22} />}>Chỉnh sửa nội dung liên hệ </Button>
                        </> : <>
                            <Button size='large' type="primary" onClick={() => setOpenCreateLienHe(true)} icon={<IoMdAdd size={22} />}>Tạo nội dung liên hệ </Button>
                        </>
                    }              
                </div>
                <div className="card-body p-3">
                    <div className="chart">
                        <h6>Đây là nội dung của trang liên hệ</h6>
                        <div className="row mt-1 card-body p-4" style={{border: "1px solid #f0f0f0", borderRadius: "10px"}}>
                            <div  dangerouslySetInnerHTML={{ __html: dataLienHe?.text }} />
                        </div>
                    </div>
                </div>
                </div>
            </div>                                                          
        </div>

        <CreateThueGame
            openCreateThueGame={openCreateThueGame}
            setOpenCreateThueGame={setOpenCreateThueGame}
            fetchOneThueGames={fetchOneThueGames}
        />
        <CreateLienHe
            openCreateLienHe={openCreateLienHe}
            setOpenCreateLienHe={setOpenCreateLienHe}
            fetchOneLienHes={fetchOneLienHes}
        />

        <UpdateThueGame
            openUpdateThueGame={openUpdateThueGame}
            setOpenUpdateThueGame={setOpenUpdateThueGame}
            fetchOneThueGames={fetchOneThueGames}
            dataThueGame={dataThueGame}
        />
        <UpdateLienHe
            openUpdateThueGame={openUpdateLienHe}
            setOpenUpdateThueGame={setOpenUpdateLienHe}
            fetchOneThueGames={fetchOneLienHes}
            dataThueGame={dataLienHe}
        />
        </>
    )
}

export default ThueGameVaLienHe