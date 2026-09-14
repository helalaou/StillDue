import {expect,type Page} from '@playwright/test';
export async function enterDemo(page:Page){await page.goto('/');await page.getByRole('button',{name:'Explore the demo'}).click();await expect(page.getByRole('heading',{name:'Room to focus.'})).toBeVisible()}
export async function navigate(page:Page,label:string){const menu=page.getByRole('button',{name:'Open navigation'});if(await menu.isVisible())await menu.click();await page.getByRole('link',{name:label,exact:true}).click()}
