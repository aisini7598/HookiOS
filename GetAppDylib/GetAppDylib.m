//  weibo: http://weibo.com/xiaoqing28
//  blog:  http://www.alonemonkey.com
//
//  GetAppDylib.m
//  GetAppDylib
//
//  Created by john on 2018/3/5.
//  Copyright (c) 2018年 john. All rights reserved.
//

#import "GetAppDylib.h"
#import <CaptainHook/CaptainHook.h>
#import <UIKit/UIKit.h>
#import <Cycript/Cycript.h>
#import <objc/runtime.h>
#include <objc/objc.h>

#import "NSObject+fullDescription.h"


static __attribute__((constructor)) void entry(){
    NSLog(@"\n               🎉!!！congratulations!!！🎉\n👍----------------insert dylib success----------------👍");
    
    [[NSNotificationCenter defaultCenter] addObserverForName:UIApplicationDidFinishLaunchingNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification * _Nonnull note) {

        
        CYListenServer(6666);
    }];
}

@interface CustomViewController

-(NSString*)getMyName;

@end

CHDeclareClass(CustomViewController)

CHOptimizedMethod(0, self, NSString*, CustomViewController,getMyName){
    //get origin value
    NSString* originName = CHSuper(0, CustomViewController, getMyName);
    
    NSLog(@"origin name is:%@",originName);
    
    //get property
    NSString* password = CHIvar(self,_password,__strong NSString*);
    
    NSLog(@"password is %@",password);
    
    //change the value
    return @"AloneMonkey";
    
}

@interface StorytellingVipH5ViewController

- (void)printClassName;

@end

CHDeclareClass(StorytellingVipH5ViewController)


//CHDeclareMethod1(void, StorytellingVipH5ViewController, printClassName, SEL, selector) {
//
//
//}

CHDeclareMethod(0, void,StorytellingVipH5ViewController,printClassName){
    unsigned int methodCount =0;
    Method* methodList = class_copyMethodList(NSClassFromString(@"StorytellingVipH5ViewController"),&methodCount);
    NSMutableArray *methodsArray = [NSMutableArray arrayWithCapacity:methodCount];
    
    for(int i=0;i<methodCount;i++)
    {
        Method temp = methodList[i];
        IMP imp = method_getImplementation(temp);
        SEL name_f = method_getName(temp);
        const char* name_s =sel_getName(method_getName(temp));
        int arguments = method_getNumberOfArguments(temp);
        const char* encoding =method_getTypeEncoding(temp);
        NSLog(@"方法名：%@,参数个数：%d,编码方式：%@",[NSString stringWithUTF8String:name_s],
              arguments,
              [NSString stringWithUTF8String:encoding]);
        [methodsArray addObject:[NSString stringWithUTF8String:name_s]];
    }
    free(methodList);
}

CHDeclareClass(FMAlreadyPaidStorytellingViewController)

CHMethod2(void, FMAlreadyPaidStorytellingViewController, tableView, UITableView *, tableView, didSelectRowAtIndexPath, NSIndexPath *, indexPath) {

    CHSuper2(FMAlreadyPaidStorytellingViewController, tableView, tableView, didSelectRowAtIndexPath, indexPath);
}


@interface FMAlreadyPaidStorytellingTableViewCell

- (void)printName;

@end

CHDeclareClass(FMAlreadyPaidStorytellingTableViewCell)


CHDeclareMethod(0, void,FMAlreadyPaidStorytellingTableViewCell,printName){
    unsigned int methodCount =0;
    Method* methodList = class_copyMethodList(NSClassFromString(@"FMAlreadyPaidStorytellingTableViewCell"),&methodCount);
    NSMutableArray *methodsArray = [NSMutableArray arrayWithCapacity:methodCount];
    
    for(int i=0;i<methodCount;i++)
    {
        Method temp = methodList[i];
        IMP imp = method_getImplementation(temp);
        SEL name_f = method_getName(temp);
        const char* name_s =sel_getName(method_getName(temp));
        int arguments = method_getNumberOfArguments(temp);
        const char* encoding =method_getTypeEncoding(temp);
        NSLog(@"方法名：%@,参数个数：%d,编码方式：%@",[NSString stringWithUTF8String:name_s],
              arguments,
              [NSString stringWithUTF8String:encoding]);
        [methodsArray addObject:[NSString stringWithUTF8String:name_s]];
    }
    free(methodList);
}

CHMethod0(void, FMAlreadyPaidStorytellingTableViewCell, layoutSubviews) {
    [self printName];
    CHSuper0(FMAlreadyPaidStorytellingTableViewCell, layoutSubviews);
}

CHDeclareClass(StoryTellDetailModel)

CHMethod0(NSNumber *, StoryTellDetailModel, is_buy) {
    return [NSNumber numberWithInt:1];
}

CHMethod0(NSNumber *, StoryTellDetailModel, is_vip_gived) {
    return [NSNumber numberWithInt:1];
}

CHMethod0(NSNumber *, StoryTellDetailModel, status) {
    return [NSNumber numberWithInt:1];
}

CHMethod0(NSNumber *, StoryTellDetailModel, is_borrowed) {
    return [NSNumber numberWithInt:1];
}

CHDeclareClass(SubscribeDetailViewControllerV2)

CHMethod0(BOOL, SubscribeDetailViewControllerV2, isPaidSign) {
    
    return YES;
}

CHDeclareClass(DDEBookInfoModel)

CHMethod0(NSNumber *, DDEBookInfoModel , status) {
    
    return [NSNumber numberWithInt:2];
}

//CHMethod1(void, StorytellingVipH5ViewController, viewWillAppear, BOOL, animation) {
//
//    [self printClassName];
//
//    CHSuper1(StorytellingVipH5ViewController, viewWillAppear, animation);
//}
//
//CHMethod1(void, StorytellingVipH5ViewController, DDLeakWebViewJSHandler, NSDictionary *, arg1) {
//
//    NSMutableDictionary *argument = [NSMutableDictionary dictionaryWithDictionary:arg1];
//
//    if ([argument objectForKey:@"allowClick"]) {
//        argument[@"allowClick"] = @(1);
//    }
//
//    CHSuper1(StorytellingVipH5ViewController, DDLeakWebViewJSHandler, argument);
//}


CHConstructor{
    CHLoadLateClass(CustomViewController);
    CHClassHook(0, CustomViewController, getMyName);
    
    CHLoadLateClass(StorytellingVipH5ViewController);
//    CHClassHook1(StorytellingVipH5ViewController,viewWillAppear);
//    CHClassHook1(StorytellingVipH5ViewController,DDLeakWebViewJSHandler);
    
    CHLoadLateClass(FMAlreadyPaidStorytellingTableViewCell);
    CHClassHook0(FMAlreadyPaidStorytellingTableViewCell, layoutSubviews);
    
    CHLoadLateClass(FMAlreadyPaidStorytellingViewController);
    CHClassHook2(FMAlreadyPaidStorytellingViewController, tableView, didSelectRowAtIndexPath);
    
    CHLoadLateClass(StoryTellDetailModel);
    CHClassHook(0, StoryTellDetailModel, is_buy);
    CHClassHook(0, StoryTellDetailModel, is_borrowed);
    CHClassHook(0, StoryTellDetailModel, status);
    CHClassHook(0, StoryTellDetailModel, is_vip_gived);
    
    CHLoadLateClass(SubscribeDetailViewControllerV2);
    CHClassHook0(SubscribeDetailViewControllerV2, isPaidSign);
    
    CHLoadLateClass(DDEBookInfoModel);
    CHClassHook0(DDEBookInfoModel, status);
}



