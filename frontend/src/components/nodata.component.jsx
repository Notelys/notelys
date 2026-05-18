import Icon from "./Icon";

const NoDataMessage = ({ message }) => {

    return(
        <div className="text-center w-full py-14 mt-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-grey flex items-center justify-center">
                <Icon name="inbox" className="text-2xl text-dark-grey" />
            </div>
            <p className="text-dark-grey text-lg font-medium">{ message }</p>
            <p className="text-dark-grey/50 text-sm mt-1.5">Check back later for new content</p>
        </div>
    )

}

export default NoDataMessage;