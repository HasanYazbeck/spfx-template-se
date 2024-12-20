import * as React from 'react';
import styles from './Spfx.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TabsComponent extends React.Component< {}, {} > {
    private activeTab: string;
    private tabButtons: NodeListOf<Element>;
    private tabContents: NodeListOf<Element>;

    constructor(){
        super();
        this.activeTab = 'site-tab';
        this.tabButtons = document.querySelectorAll('.nav-link');
        this.tabContents = document.querySelectorAll('.tab-pane');
        this.initializeTabs();
    }

    private initializeTabs() : void {
        for(let i = 0; i < this.tabButtons.length; i++){
            const htmlButton =  this.tabButtons[i] as HTMLButtonElement;
            htmlButton.addEventListener('click' , this.switchTab.bind(this));
        }
    }

    private switchTab(event: Event): void {
        const button = event.target as HTMLButtonElement;
        const targetId= button.getAttribute('formTarget').substring(1);

        if(!targetId) return;

        for(let i = 0; i < this.tabButtons.length; i++){
            const htmlButton = this.tabButtons[i] as HTMLButtonElement;
            htmlButton.classList.remove('active');
            htmlButton.setAttribute('aria-selected' , 'false');
        }

        for(let i = 0; i < this.tabContents.length; i++){
            const content = this.tabContents[i] as HTMLDivElement;
            content.classList.remove('show','active');
        }
        
        button.classList.add('active');
        button.setAttribute('aria-selected' , 'true');

        const activeTabContent = document.getElementById(targetId);
        if(activeTabContent){
            activeTabContent.classList.add('show','active')
        }

        this.activeTab = targetId;
    }

    public render(): React.ReactElement<{}> {
        return (
            <div>
                <ul className={`nav nav-tabs`} id='nav-bar-tab' role='tablist'>
                    <li className={`nav-item`} role='presentation'>
                        <button className={`nav-link active`} id='site-tab' formTarget='#site-tab-pane' type='button' role='tab'>Sites</button>
                    </li>

                    <li className={`nav-item dropdown`} role='presentation'>
                        <button className={`nav-link`} id='problems-tab' formTarget='#problems-tab-pane' type='button' role='tab'>Problems</button>
                    </li>

                    <li className={`nav-item`} role='presentation'>
                        <button className={`nav-link`} id='userfulNumbers-tab' formTarget='#userfulNumbers-tab-pane' type='button' role='tab'>Usefull Numbers</button>
                    </li>

                    <li className={`nav-item`} role='presentation'>
                        <button className={`nav-link`} id='report-tab' formTarget='#report-tab-pane' type='button' role='tab'>Report</button>
                    </li>
                </ul>
                <div className={`tab-content`} id='nav-bar-tab-content'>
                    <div className={`tab-pane fade show active`} id='site-tab-pane' role='tabpanel' tabIndex={0}>
                        <h2>SharePoint List CRUD</h2>
                    </div>
                </div>
                <div className={`tab-pane fade`} id='problems-tab-pane' role='tabpanel' tabIndex={0}>
                    Problems Content
                </div><div className={`tab-pane fade`} id='userfulNumbers-tab-pane' role='tabpanel' tabIndex={0}>
                    Usefull Numbers Content
                </div><div className={`tab-pane fade`} id='report-tab-pane' role='tabpanel' tabIndex={0}>
                    Report Content
                </div>
            </div>
        );
    }

    
}

document.addEventListener('DOMContentLoaded' , () => {
    new TabsComponent();
});